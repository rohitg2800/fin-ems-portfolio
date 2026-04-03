const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const stripeLib = require('stripe');

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function normalizeItemsMap(items) {
  if (!items || typeof items !== 'object' || Array.isArray(items)) return [];

  return Object.entries(items)
    .map(([productId, quantity]) => [String(productId), Math.floor(Number(quantity))])
    .filter(([productId, quantity]) => productId && Number.isFinite(quantity) && quantity > 0);
}

function createStoreService({ knex, env = process.env }) {
  const adminEmail = (env.ADMIN_EMAIL || 'admin@emsluxe.com').toLowerCase();
  const adminPassword = env.ADMIN_PASSWORD || 'Admin@12345';
  const adminName = env.ADMIN_NAME || 'EMS Admin';
  const stripeSecretKey = env.STRIPE_SECRET_KEY;
  const stripeWebhookSecret = env.STRIPE_WEBHOOK_SECRET;
  const frontendBaseUrl = (env.FRONTEND_BASE_URL || 'https://fin-ems-frontend.onrender.com').replace(/\/+$/, '');
  const smtpHost = env.SMTP_HOST;
  const smtpPort = Number(env.SMTP_PORT || 587);
  const smtpSecure = String(env.SMTP_SECURE || 'false') === 'true';
  const smtpUser = env.SMTP_USER;
  const smtpPass = env.SMTP_PASS;
  const smtpFrom = env.SMTP_FROM || smtpUser || 'no-reply@emsluxe.com';
  const stripe = stripeSecretKey ? stripeLib(stripeSecretKey) : null;

  let auditTableReady = null;
  let mailer = null;

  function getMailer() {
    if (!smtpHost || !smtpUser || !smtpPass) return null;
    if (mailer) return mailer;

    mailer = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    return mailer;
  }

  function toMoney(value) {
    return Number(value || 0).toFixed(2);
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

      const password_hash = await bcrypt.hash(adminPassword, 12);

      await knex('users')
        .insert({
          name: adminName,
          email: adminEmail,
          password_hash,
          role: 'admin',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now()
        })
        .onConflict('email')
        .merge({
          name: adminName,
          password_hash,
          role: 'admin',
          updated_at: knex.fn.now()
        });

      console.log(`Admin user ensured for ${adminEmail}`);
    } catch (err) {
      console.error('Admin bootstrap failed:', err.message);
    }
  }

  async function ensureProductsSeeded() {
    try {
      const hasProductsTable = await knex.schema.hasTable('products');
      if (!hasProductsTable) return;

      const [{ count }] = await knex('products').count({ count: '*' });
      if (Number(count || 0) > 0) return;

      const seed = require('./seeds/01_products');
      if (seed && typeof seed.seed === 'function') {
        await seed.seed(knex);
        console.log('Products table was empty — seeded default catalog.');
      }
    } catch (err) {
      console.error('Product seeding check failed:', err.message);
    }
  }

  async function buildOrderReceipt(orderId) {
    const order = await knex('orders').where({ id: orderId }).first();
    if (!order) return null;

    const rows = await knex('order_items')
      .leftJoin('products', 'order_items.product_id', 'products.id')
      .where('order_items.order_id', orderId)
      .select(
        'order_items.product_id',
        'order_items.quantity',
        'order_items.unit_price',
        'products.name as product_name',
        'products.sku as product_sku'
      );

    const items = rows.map((row) => {
      const unitPrice = Number(row.unit_price || 0);
      const quantity = Number(row.quantity || 0);
      return {
        product_id: row.product_id,
        name: row.product_name || row.product_id,
        sku: row.product_sku || '',
        quantity,
        unit_price: unitPrice,
        line_total: Number((unitPrice * quantity).toFixed(2))
      };
    });

    const subtotal = Number(items.reduce((sum, item) => sum + item.line_total, 0).toFixed(2));
    return {
      order: {
        id: order.id,
        user_id: order.user_id,
        name: order.name,
        email: order.email,
        phone: order.phone,
        address: order.address,
        status: order.status,
        created_at: order.created_at,
        total: Number(order.total || subtotal)
      },
      items,
      totals: {
        subtotal,
        grand_total: Number(order.total || subtotal)
      }
    };
  }

  function canAccessReceipt(order, authUser) {
    if (authUser?.role === 'admin') return true;
    if (authUser?.id && order.user_id && String(authUser.id) === String(order.user_id)) return true;
    if (authUser?.email && order.email && authUser.email.toLowerCase() === String(order.email).toLowerCase()) return true;
    return false;
  }

  async function sendOrderConfirmationEmail(receipt) {
    const transport = getMailer();
    if (!transport || !receipt?.order?.email) return;

    const orderId = receipt.order.id;
    const status = String(receipt.order.status || 'pending').toUpperCase();
    const itemsText = receipt.items
      .map((item) => `- ${item.name} x${item.quantity} @ $${toMoney(item.unit_price)} = $${toMoney(item.line_total)}`)
      .join('\n');
    const itemsHtml = receipt.items
      .map((item) => `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;">${item.name}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right;">$${toMoney(item.unit_price)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right;">$${toMoney(item.line_total)}</td></tr>`)
      .join('');

    await transport.sendMail({
      from: smtpFrom,
      to: receipt.order.email,
      subject: `EMS Luxe Order #${orderId} Confirmation`,
      text: `Thanks for your order!\n\nOrder: #${orderId}\nStatus: ${status}\nTotal: $${toMoney(receipt.totals.grand_total)}\n\nItems:\n${itemsText}\n\nWe appreciate your business.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;">
          <h2>EMS Luxe Supply Order Confirmation</h2>
          <p>Thanks for your order, ${receipt.order.name || 'Customer'}.</p>
          <p><strong>Order:</strong> #${orderId}<br><strong>Status:</strong> ${status}<br><strong>Total:</strong> $${toMoney(receipt.totals.grand_total)}</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <thead>
              <tr>
                <th style="text-align:left;padding:6px 8px;border-bottom:2px solid #ddd;">Item</th>
                <th style="text-align:center;padding:6px 8px;border-bottom:2px solid #ddd;">Qty</th>
                <th style="text-align:right;padding:6px 8px;border-bottom:2px solid #ddd;">Unit</th>
                <th style="text-align:right;padding:6px 8px;border-bottom:2px solid #ddd;">Line Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <p>If you need help, reply to this email.</p>
        </div>
      `
    });
  }

  async function listProducts() {
    return knex('products').orderBy('category', 'asc');
  }

  async function createOrder(orderInput, authUser) {
    const { name, email, phone, address, items } = orderInput || {};
    const entries = normalizeItemsMap(items);

    if (!name || !email || entries.length === 0) {
      throw createHttpError(400, 'Missing order details or empty cart');
    }

    let createdOrderId = null;
    let secureTotal = 0;

    await knex.transaction(async (trx) => {
      const orderItemsToInsert = [];

      for (const [productId, qty] of entries) {
        const product = await trx('products').where({ id: productId }).first();
        if (!product) throw createHttpError(400, `Product ${productId} not found`);
        if (product.stock_level < qty) throw createHttpError(400, `Insufficient stock for ${product.name}`);

        const itemTotal = Number(product.price) * qty;
        secureTotal += itemTotal;

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
          total: secureTotal,
          status: 'pending',
          created_at: knex.fn.now()
        })
        .returning('id');

      const orderId = newOrder.id || newOrder;
      createdOrderId = orderId;

      await trx('order_items').insert(
        orderItemsToInsert.map((item) => ({
          ...item,
          order_id: orderId
        }))
      );
    });

    if (createdOrderId) {
      const receipt = await buildOrderReceipt(createdOrderId);
      if (receipt) {
        sendOrderConfirmationEmail(receipt).catch((err) => {
          console.error(`Order email failed for #${createdOrderId}:`, err.message);
        });
      }
    }

    return {
      success: true,
      orderId: createdOrderId,
      secureTotal,
      message: `Order #${createdOrderId} securely processed.`
    };
  }

  async function getReceipt(orderId, { authUser } = {}) {
    const receipt = await buildOrderReceipt(orderId);
    if (!receipt) throw createHttpError(404, 'Order not found');
    if (!canAccessReceipt(receipt.order, authUser)) {
      throw createHttpError(403, 'Access denied');
    }
    return receipt;
  }

  async function listOrders(authUser) {
    const hasUsersTable = await knex.schema.hasTable('users');

    if (hasUsersTable && authUser.role === 'admin') {
      return knex('orders')
        .leftJoin('users', 'orders.user_id', 'users.id')
        .select('orders.*', 'users.name as user_name', 'users.email')
        .orderBy('orders.created_at', 'desc')
        .limit(50);
    }

    if (authUser.role === 'admin') {
      return knex('orders').orderBy('created_at', 'desc').limit(50);
    }

    return knex('orders')
      .where({ user_id: authUser.id })
      .orWhere({ email: authUser.email })
      .orderBy('created_at', 'desc')
      .limit(50);
  }

  async function listAdminOrders(adminUser, req) {
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

    await logAudit('ADMIN_VIEW_ORDERS', adminUser, req, { count: orders.length });
    return orders;
  }

  async function getAdminStats(adminUser, req) {
    const totals = await knex('orders')
      .where({ status: 'paid' })
      .sum({ total_revenue: 'total' })
      .count({ total_orders: 'id' })
      .first();

    const topSkus = await knex('order_items')
      .join('orders', 'order_items.order_id', 'orders.id')
      .leftJoin('products', 'order_items.product_id', 'products.id')
      .where('orders.status', 'paid')
      .select('order_items.product_id', 'products.name')
      .sum({ units: 'order_items.quantity' })
      .sum({ revenue: knex.raw('order_items.unit_price * order_items.quantity') })
      .groupBy('order_items.product_id', 'products.name')
      .orderBy('units', 'desc')
      .limit(5);

    const payload = {
      totalRevenue: Number(totals?.total_revenue || 0),
      totalOrders: Number(totals?.total_orders || 0),
      topSkus: topSkus.map((row) => ({
        product_id: row.product_id,
        name: row.name || row.product_id,
        units: Number(row.units || 0),
        revenue: Number(row.revenue || 0)
      }))
    };

    await logAudit('ADMIN_VIEW_STATS', adminUser, req, { topSkuCount: payload.topSkus.length });
    return payload;
  }

  async function createCheckoutSession(orderInput, authUser) {
    if (!stripe) throw createHttpError(500, 'Stripe is not configured');

    const { items, name, email, phone, address } = orderInput || {};
    const entries = normalizeItemsMap(items);

    if (!authUser?.id) {
      throw createHttpError(401, 'Unauthorized');
    }

    if (!name || !email || !phone || !address || !entries.length) {
      throw createHttpError(400, 'Missing checkout details or empty cart');
    }

    let orderId;
    const lineItems = [];
    let serverCalculatedTotal = 0;

    await knex.transaction(async (trx) => {
      const orderItemsToInsert = [];

      for (const [productId, qty] of entries) {
        const product = await trx('products').where({ id: productId }).first();
        if (!product) throw createHttpError(400, `Product ${productId} not found`);
        if (product.stock_level < qty) throw createHttpError(400, `Insufficient stock for ${product.name}`);

        const itemTotal = Number(product.price) * qty;
        serverCalculatedTotal += itemTotal;

        orderItemsToInsert.push({
          product_id: productId,
          quantity: qty,
          unit_price: product.price
        });

        await trx('products').where({ id: productId }).decrement('stock_level', qty);

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
          status: 'pending_payment',
          created_at: knex.fn.now()
        })
        .returning('id');

      orderId = newOrder.id || newOrder;

      await trx('order_items').insert(
        orderItemsToInsert.map((item) => ({
          ...item,
          order_id: orderId
        }))
      );
    });

    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: lineItems,
        customer_email: email,
        success_url: `${frontendBaseUrl}/html/thank-you.html?session_id={CHECKOUT_SESSION_ID}&order_id=${encodeURIComponent(orderId)}`,
        cancel_url: `${frontendBaseUrl}/html/shop.html?status=cancel`,
        metadata: {
          order_id: orderId,
          user_id: String(authUser.id),
          name: name || '',
          email: email || '',
          phone: phone || '',
          address: address || '',
          items: JSON.stringify(Object.fromEntries(entries))
        }
      });

      return {
        url: session.url,
        orderId
      };
    } catch (err) {
      if (orderId) {
        await knex.transaction(async (trx) => {
          const existingOrder = await trx('orders').where({ id: orderId, status: 'pending_payment' }).first();
          if (!existingOrder) return;

          const reservedItems = await trx('order_items')
            .where({ order_id: orderId })
            .select('product_id', 'quantity');

          for (const item of reservedItems) {
            await trx('products')
              .where({ id: item.product_id })
              .increment('stock_level', Number(item.quantity || 0));
          }

          await trx('orders').where({ id: orderId }).del();
        });
      }
      throw err;
    }
  }

  async function getCheckoutSessionDetails(sessionId, authUser) {
    if (!stripe) throw createHttpError(500, 'Stripe is not configured');

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const orderId = session.metadata?.order_id;
      const order = orderId ? await knex('orders').where({ id: orderId }).first() : null;
      const ownerEmail = order?.email || session.customer_details?.email || session.metadata?.email || null;
      const ownerId = order?.user_id || session.metadata?.user_id || null;

      if (authUser?.role !== 'admin') {
        const sameUser = ownerId && String(ownerId) === String(authUser?.id);
        const sameEmail = authUser?.email && ownerEmail &&
          authUser.email.toLowerCase() === String(ownerEmail).toLowerCase();

        if (!sameUser && !sameEmail) {
          throw createHttpError(403, 'Access denied');
        }
      }

      return {
        status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
        order,
        email: ownerEmail
      };
    } catch (err) {
      if (err.status) throw err;
      throw createHttpError(400, 'Unable to fetch session');
    }
  }

  async function handleStripeCheckoutCompleted(session) {
    const name = session.metadata?.name || session.customer_details?.name || null;
    const email = session.customer_details?.email || session.metadata?.email || null;
    const phone = session.metadata?.phone || session.customer_details?.phone || null;
    const address = session.metadata?.address || (session.customer_details?.address ? JSON.stringify(session.customer_details.address) : null);
    const userId = session.metadata?.user_id || null;
    const existingOrderId = session.metadata?.order_id;
    let finalizedOrderId = null;

    await knex.transaction(async (trx) => {
      if (existingOrderId) {
        const existing = await trx('orders').where({ id: existingOrderId }).first();
        if (existing) {
          if (existing.status === 'paid') {
            finalizedOrderId = existingOrderId;
            return;
          }

          await trx('orders')
            .where({ id: existingOrderId })
            .update({
              status: 'paid',
              name: name || existing.name,
              email: email || existing.email,
              phone: phone || existing.phone,
              address: address || existing.address,
              updated_at: knex.fn.now()
            });
          finalizedOrderId = existingOrderId;
          return;
        }
      }

      const entries = normalizeItemsMap(JSON.parse(session?.metadata?.items || '{}'));
      if (!entries.length) return;

      let serverCalculatedTotal = 0;
      const orderItemsToInsert = [];

      for (const [productId, qty] of entries) {
        const product = await trx('products').where({ id: productId }).first();
        if (!product) throw createHttpError(400, `Product ${productId} not found`);
        if (product.stock_level < qty) throw createHttpError(400, `Insufficient stock for ${product.name}`);

        const itemTotal = Number(product.price) * qty;
        serverCalculatedTotal += itemTotal;

        orderItemsToInsert.push({
          product_id: productId,
          quantity: qty,
          unit_price: product.price
        });
      }

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

      const orderId = newOrder.id || newOrder;
      finalizedOrderId = orderId;

      await trx('order_items').insert(
        orderItemsToInsert.map((item) => ({
          ...item,
          order_id: orderId
        }))
      );

      for (const item of orderItemsToInsert) {
        await trx('products').where({ id: item.product_id }).decrement('stock_level', item.quantity);
      }
    });

    if (finalizedOrderId) {
      const receipt = await buildOrderReceipt(finalizedOrderId);
      if (receipt) {
        sendOrderConfirmationEmail(receipt).catch((err) => {
          console.error(`Stripe order email failed for #${finalizedOrderId}:`, err.message);
        });
      }
    }
  }

  async function handleStripeCheckoutCanceled(session) {
    const orderId = session?.metadata?.order_id;
    if (!orderId) return;

    await knex.transaction(async (trx) => {
      const order = await trx('orders').where({ id: orderId }).first();
      if (!order || order.status !== 'pending_payment') return;

      const reservedItems = await trx('order_items')
        .where({ order_id: orderId })
        .select('product_id', 'quantity');

      for (const item of reservedItems) {
        await trx('products')
          .where({ id: item.product_id })
          .increment('stock_level', Number(item.quantity || 0));
      }

      await trx('orders')
        .where({ id: orderId })
        .update({ status: 'canceled', updated_at: knex.fn.now() });
    });
  }

  async function handleStripeWebhook(rawBody, signature) {
    if (!stripe || !stripeWebhookSecret) {
      throw createHttpError(400, 'Stripe not configured');
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, stripeWebhookSecret);
    } catch (err) {
      throw createHttpError(400, `Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      await handleStripeCheckoutCompleted(event.data.object);
    } else if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
      await handleStripeCheckoutCanceled(event.data.object);
    }

    return { received: true };
  }

  async function healthCheck() {
    await knex.raw('SELECT 1');
    return { status: 'Healthy ✅', db: 'Connected via Knex' };
  }

  return {
    ensureAdminUser,
    ensureProductsSeeded,
    listProducts,
    createOrder,
    getReceipt,
    listOrders,
    listAdminOrders,
    getAdminStats,
    createCheckoutSession,
    getCheckoutSessionDetails,
    handleStripeWebhook,
    healthCheck
  };
}

module.exports = { createStoreService };
