require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const jwt = require('jsonwebtoken');

const environment = process.env.NODE_ENV || 'development';
const knexConfig = require('./knexfile')[environment];
const knex = require('knex')(knexConfig);

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, '..', 'ems-frontend');
let auditTableReady = null;

// FIX 1: Configured Helmet to allow external images (iStock, Unsplash)
app.use(helmet({
  contentSecurityPolicy: false, 
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
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

app.listen(PORT, () => {
  console.log(`🚀 EMS-LUXY Server running on port ${PORT}`);
});
