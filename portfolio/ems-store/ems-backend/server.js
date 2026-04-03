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
const { createStoreService } = require('./store-service');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, '..', 'ems-frontend');
const storeService = createStoreService({ knex });

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(cors({ origin: '*' }));
app.use(express.static(FRONTEND_DIR));

function getAuthUser(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
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

function respondWithError(res, err, fallbackMessage, fallbackStatus = 500) {
  const status = err?.status || fallbackStatus;
  const message = err?.message || fallbackMessage;
  res.status(status).json({ error: message });
}

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const result = await storeService.handleStripeWebhook(req.body, req.headers['stripe-signature']);
    res.json(result);
  } catch (err) {
    if (err.status === 400) {
      return res.status(400).send(err.message);
    }
    console.error('Stripe webhook handling failed:', err.message);
    res.status(500).send('Webhook handler failed');
  }
});

app.use(express.json({ limit: '10mb' }));

app.get('/api/health', async (req, res) => {
  try {
    const payload = await storeService.healthCheck();
    res.json(payload);
  } catch (err) {
    respondWithError(res, err, `DB Connection Failed: ${err.message}`);
  }
});

app.use('/api/auth', authRoutes);

app.post('/api/checkout/session', requireAuth, async (req, res) => {
  try {
    const payload = await storeService.createCheckoutSession(req.body || {}, req.user);
    res.json(payload);
  } catch (err) {
    console.error('Create checkout session failed:', err.message);
    respondWithError(res, err, 'Unable to create checkout session');
  }
});

app.get('/api/checkout/session/:id', requireAuth, async (req, res) => {
  try {
    const payload = await storeService.getCheckoutSessionDetails(req.params.id, req.user);
    res.json(payload);
  } catch (err) {
    console.error('Fetch checkout session failed:', err.message);
    respondWithError(res, err, 'Unable to fetch session');
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await storeService.listProducts();
    res.json(products);
  } catch (err) {
    console.error('Products error:', err.message);
    respondWithError(res, err, 'Failed to fetch inventory');
  }
});

app.post('/api/orders', async (req, res) => {
  res.status(410).json({
    error: 'Direct order placement is disabled. Use secure checkout instead.'
  });
});

app.get('/api/orders/:id/receipt', requireAuth, async (req, res) => {
  try {
    const receipt = await storeService.getReceipt(req.params.id, {
      authUser: req.user
    });
    res.json(receipt);
  } catch (err) {
    respondWithError(res, err, 'Unable to fetch receipt');
  }
});

app.get('/api/orders', requireAuth, async (req, res) => {
  try {
    const orders = await storeService.listOrders(req.user);
    res.json(orders);
  } catch (err) {
    respondWithError(res, err, 'Unable to fetch orders');
  }
});

app.get('/api/admin/orders', requireAdmin, async (req, res) => {
  try {
    const orders = await storeService.listAdminOrders(req.user, req);
    res.json(orders);
  } catch (err) {
    respondWithError(res, err, 'Unable to fetch admin orders');
  }
});

app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const payload = await storeService.getAdminStats(req.user, req);
    res.json(payload);
  } catch (err) {
    respondWithError(res, err, 'Unable to fetch admin stats');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

process.on('SIGTERM', async () => {
  console.log('Shutting down EMS Luxe Store...');
  await knex.destroy();
  process.exit(0);
});

async function startServer() {
  await storeService.ensureAdminUser();
  await storeService.ensureProductsSeeded();
  app.listen(PORT, () => {
    console.log(`EMS Luxe Store server running on port ${PORT}`);
  });
}

startServer();
