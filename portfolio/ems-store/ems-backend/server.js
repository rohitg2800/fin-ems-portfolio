require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const jwt = require('jsonwebtoken');
const stripeLib = require('stripe');

const environment = process.env.NODE_ENV || 'development';
const knexConfig = require('./knexfile')[environment];
const knex = require('knex')(knexConfig);

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, '..', 'ems-frontend');
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@emsluxe.com').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@12345';
const ADMIN_NAME = process.env.ADMIN_NAME || 'EMS Admin';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE = STRIPE_SECRET_KEY ? stripeLib(STRIPE_SECRET_KEY) : null;
let auditTableReady = null;

// FIX 1: Configured Helmet to allow external images (iStock, Unsplash)
app.use(helmet({
  contentSecurityPolicy: false, 
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({ origin: '*' }));
app.use(express.static(FRONTEND_DIR));

function getAuthUser(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token || !process.env.JWT_SECRET) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

function requireAuth(req, res, next) {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user;
  next();
}

function requireAdmin(req, res, next) {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  req.user = user;
  next();
}

async function logAudit(action, user, req, metadata = {}) {
  try {
    if (auditTableReady === null) {
      auditTableReady = await knex.schema.hasTable('audit_logs');
    }
    if (!auditTableReady) return;
    await knex('audit_logs').insert({
      admin_user_id: user?.id || null,
      action,
      resource: req.originalUrl,
      metadata,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'] || null,
      created_at: knex.fn.now()
    });
  } catch (err) {
    console.error('Audit log failed:', err.message);
  }
}

async function ensureAdminUser() {
  try {
    const hasUsersTable = await knex.schema.hasTable('users');
    if (!hasUsersTable) return;

    const password_hash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await knex('users')
      .insert({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password_hash,
        role: 'admin',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      })
      .onConflict('email')
      .merge({
        name: ADMIN_NAME,
        password_hash,
        role: 'admin',
        updated_at: knex.fn.now()
      });

    console.log(`Admin user ensured for ${ADMIN_EMAIL}`);
  } catch (err) {
    console.error('Admin bootstrap failed:', err.message);
  }
}

async function handleStripeCheckoutCompleted(session) {
  if (!session?.metadata?.items) return;
  const items = JSON.parse(session.metadata.items || "{}");
  const entries = Object.entries(items || {});
  if (!entries.length) return;

  const name = session.metadata?.name || session.customer_details?.name || null;
  const email = session.customer_details?.email || session.metadata?.email || null;
  const phone = session.metadata?.phone || session.customer_details?.phone || null;
  const address = session.metadata?.address || (session.customer_details?.address ? JSON.stringify(session.customer_details.address) : null);
  const userId = session.metadata?.user_id || null;
  const existingOrderId = session.metadata?.order_id;

  await knex.transaction(async (trx) => {
    let serverCalculatedTotal = 0;
    const orderItemsToInsert = [];

    for (const [productId, qty] of entries) {
      const product = await trx('products').where({ id: productId }).first();
      if (!product) throw new Error(`Product ${productId} not found`);
      if (product.stock_level < qty) throw new Error(`Insufficient stock for ${product.name}`);

      const itemTotal = Number(product.price) * qty;
      serverCalculatedTotal += itemTotal;

      orderItemsToInsert.push({
        product_id: productId,
        quantity: qty,
        unit_price: product.price
      });
    }

    let orderId = existingOrderId;

    if (existingOrderId) {
      const existing = await trx('orders').where({ id: existingOrderId }).first();
      if (existing && existing.status === 'paid') return;

      await trx('orders')
        .where({ id: existingOrderId })
        .update({
          total: serverCalculatedTotal,
          status: 'paid',
          name,
          email,
          phone,
          address,
          updated_at: knex.fn.now()
        });
    } else {
      const [newOrder] = await trx('orders')
        .insert({
          user_id: userId || null,
          name,
          email,
          phone,
          address,
          total: serverCalculatedTotal,
          status: 'paid',
          created_at: knex.fn.now()
        })
        .returning('id');
      orderId = newOrder.id || newOrder;
    }

    await trx('order_items').where({ order_id: orderId }).del();
    const itemsWithOrderId = orderItemsToInsert.map(item => ({ ...item, order_id: orderId }));
    await trx('order_items').insert(itemsWithOrderId);

    for (const { product_id, quantity } of itemsWithOrderId) {
      await trx('products').where({ id: product_id }).decrement('stock_level', quantity);
    }
  });
}

async function handleStripeCheckoutCanceled(session) {
  const orderId = session?.metadata?.order_id;
  if (!orderId) return;
  await knex('orders')
    .where({ id: orderId, status: 'pending' })
    .update({ status: 'canceled', updated_at: knex.fn.now() });
}

// Stripe webhook must use raw body
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!STRIPE || !STRIPE_WEBHOOK_SECRET) {
    return res.status(400).send('Stripe not configured');
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = STRIPE.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Stripe webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      await handleStripeCheckoutCompleted(event.data.object);
    } else if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
      await handleStripeCheckoutCanceled(event.data.object);
    }
    res.json({ received: true });
  } catch (err) {
    console.error('Stripe webhook handling failed:', err.message);
    res.status(500).send('Webhook handler failed');
  }
});

// JSON parser for all other routes
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await knex.raw('SELECT 1');
    res.json({ status: 'Healthy ✅', db: 'Connected via Knex' });
  } catch (err) {
    res.status(500).json({ error: 'DB Connection Failed: ' + err.message });
  }
});

// Auth routes
app.use('/api/auth', authRoutes);

// Create Stripe Checkout Session
app.post('/api/checkout/session', async (req, res) => {
  if (!STRIPE) return res.status(500).json({ error: 'Stripe is not configured' });

  const { items, name, email, phone, address } = req.body || {};
  const authUser = getAuthUser(req);

  if (!items || !Object.keys(items).length) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  let orderId;
  let lineItems = [];
  let serverCalculatedTotal = 0;

  try {
    await knex.transaction(async (trx) => {
      const orderItemsToInsert = [];

      for (const [productId, qty] of Object.entries(items)) {
        const product = await trx('products').where({ id: productId }).first();
        if (!product) throw new Error(`Product ${productId} not found`);
        if (product.stock_level < qty) throw new Error(`Insufficient stock for ${product.name}`);

        const itemTotal = Number(product.price) * qty;
        serverCalculatedTotal += itemTotal;

        orderItemsToInsert.push({
          product_id: productId,
          quantity: qty,
          unit_price: product.price
        });

        lineItems.push({
          quantity: qty,
          price_data: {
            currency: 'usd',
            product_data: { name: product.name },
            unit_amount: Math.round(Number(product.price) * 100)
          }
        });
      }

      const [newOrder] = await trx('orders')
        .insert({
          user_id: authUser?.id || null,
          name,
          email,
          phone,
          address,
          total: serverCalculatedTotal,
          status: 'pending',
          created_at: knex.fn.now()
        })
        .returning('id');

      orderId = newOrder.id || newOrder;

      const itemsWithOrderId = orderItemsToInsert.map(item => ({ ...item, order_id: orderId }));
      await trx('order_items').insert(itemsWithOrderId);
    });

    const session = await STRIPE.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: email,
      success_url: 'https://fin-ems-frontend.onrender.com/html/thank-you.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://fin-ems-frontend.onrender.com/html/shop.html?status=cancel',
      metadata: {
        order_id: orderId,
        user_id: authUser?.id || '',
        name: name || '',
        email: email || '',
        phone: phone || '',
        address: address || '',
        items: JSON.stringify(items)
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Create checkout session failed:', err.message);
    if (orderId) {
      await knex('orders').where({ id: orderId }).del();
      await knex('order_items').where({ order_id: orderId }).del();
    }
    const statusCode = err.message.includes('stock') || err.message.includes('not found') ? 400 : 500;
    res.status(statusCode).json({ error: err.message });
  }
});

// Fetch Checkout Session details (for receipt display)
app.get('/api/checkout/session/:id', async (req, res) => {
  if (!STRIPE) return res.status(500).json({ error: 'Stripe is not configured' });
  try {
    const session = await STRIPE.checkout.sessions.retrieve(req.params.id);
    const orderId = session.metadata?.order_id;
    const order = orderId ? await knex('orders').where({ id: orderId }).first() : null;
    res.json({
      status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
      order,
      email: order?.email || session.customer_details?.email || session.metadata?.email || null
    });
  } catch (err) {
    console.error('Fetch checkout session failed:', err.message);
    res.status(400).json({ error: 'Unable to fetch session' });
  }
});

// GET /api/products
app.get('/api/products', async (req, res) => {
  try {
    const products = await knex('products').orderBy('category', 'asc');
    res.json(products);
  } catch (err) {
    console.error('Products error:', err);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// POST /api/orders — Secure Checkout
app.post('/api/orders', async (req, res) => {
  const { name, email, phone, address, items } = req.body;
  const authUser = getAuthUser(req);
  
  if (!name || !email || !items || Object.keys(items).length === 0) {
    return res.status(400).json({ error: 'Missing order details or empty cart' });
  }

  try {
    await knex.transaction(async (trx) => {
      let serverCalculatedTotal = 0;
      const orderItemsToInsert = [];

      for (const [productId, qty] of Object.entries(items)) {
        const product = await trx('products').where({ id: productId }).first();
        
        if (!product) throw new Error(`Product ${productId} not found`);
        if (product.stock_level < qty) throw new Error(`Insufficient stock for ${product.name}`);

        const itemTotal = product.price * qty;
        serverCalculatedTotal += itemTotal;

        orderItemsToInsert.push({
          product_id: productId,
          quantity: qty,
          unit_price: product.price
        });

        await trx('products').where({ id: productId }).decrement('stock_level', qty);
      }

      const [newOrder] = await trx('orders')
        .insert({
          user_id: authUser?.id || null,
          name,
          email,
          phone: phone || null,
          address: address || null,
          total: serverCalculatedTotal,
          status: 'pending',
          created_at: knex.fn.now()
        })
        .returning('id');

      const orderId = newOrder.id || newOrder; 

      const itemsWithOrderId = orderItemsToInsert.map(item => ({
        ...item,
        order_id: orderId
      }));
      
      await trx('order_items').insert(itemsWithOrderId);

      res.status(201).json({ 
        success: true, 
        orderId: orderId, 
        secureTotal: serverCalculatedTotal,
        message: `Order #${orderId} securely processed.` 
      });
    });

  } catch (err) {
    console.error('Secure Order Transaction Failed:', err.message);
    const statusCode = err.message.includes('stock') || err.message.includes('found') ? 400 : 500;
    res.status(statusCode).json({ error: err.message });
  }
});

// GET /api/orders
app.get('/api/orders', requireAuth, async (req, res) => {
  try {
    const authUser = req.user;

    // FIX 2: Safely check if 'users' table exists before joining, to prevent a hard crash
    const hasUsersTable = await knex.schema.hasTable('users');
    
    let orders;
    if (hasUsersTable && authUser.role === 'admin') {
      orders = await knex('orders')
        .leftJoin('users', 'orders.user_id', 'users.id')
        .select('orders.*', 'users.name as user_name', 'users.email')
        .orderBy('orders.created_at', 'desc')
        .limit(50);
    } else if (authUser.role === 'admin') {
      orders = await knex('orders').orderBy('created_at', 'desc').limit(50);
    } else {
      orders = await knex('orders')
        .where({ user_id: authUser.id })
        .orWhere({ email: authUser.email })
        .orderBy('created_at', 'desc')
        .limit(50);
    }
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/orders (admin only)
app.get('/api/admin/orders', requireAdmin, async (req, res) => {
  try {
    const hasUsersTable = await knex.schema.hasTable('users');
    let orders;
    if (hasUsersTable) {
      orders = await knex('orders')
        .leftJoin('users', 'orders.user_id', 'users.id')
        .select('orders.*', 'users.name as user_name', 'users.email')
        .orderBy('orders.created_at', 'desc')
        .limit(100);
    } else {
      orders = await knex('orders').orderBy('created_at', 'desc').limit(100);
    }

    await logAudit('ADMIN_VIEW_ORDERS', req.user, req, { count: orders.length });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/stats (admin only)
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const totals = await knex('orders')
      .sum({ total_revenue: 'total' })
      .count({ total_orders: 'id' })
      .first();

    const topSkus = await knex('order_items')
      .leftJoin('products', 'order_items.product_id', 'products.id')
      .select('order_items.product_id', 'products.name')
      .sum({ units: 'order_items.quantity' })
      .sum({ revenue: knex.raw('order_items.unit_price * order_items.quantity') })
      .groupBy('order_items.product_id', 'products.name')
      .orderBy('units', 'desc')
      .limit(5);

    const payload = {
      totalRevenue: Number(totals?.total_revenue || 0),
      totalOrders: Number(totals?.total_orders || 0),
      topSkus: topSkus.map(row => ({
        product_id: row.product_id,
        name: row.name || row.product_id,
        units: Number(row.units || 0),
        revenue: Number(row.revenue || 0)
      }))
    };

    await logAudit('ADMIN_VIEW_STATS', req.user, req, { topSkuCount: payload.topSkus.length });
    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Frontend fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down EMS-LUXY...');
  await knex.destroy(); 
  process.exit(0);
});

async function startServer() {
  await ensureAdminUser();
  app.listen(PORT, () => {
    console.log(`🚀 EMS-LUXY Server running on port ${PORT}`);
  });
}

startServer();
