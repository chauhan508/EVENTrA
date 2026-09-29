const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const seedData = require('./utils/seed');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
  })
);
app.use(express.json());
app.use(morgan('dev'));

// DB initialisation — runs once per cold start in serverless, or on startup locally.
// We track readiness so concurrent requests during cold start don't trigger multiple connects.
let dbReady = false;
let dbInitPromise = null;

const ensureDB = async () => {
  if (dbReady) return;
  if (!dbInitPromise) {
    dbInitPromise = connectDB()
      .then(() => seedData())
      .then(() => {
        dbReady = true;
      });
  }
  return dbInitPromise;
};

// Initialise DB before handling any request
app.use(async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (err) {
    console.error('Database initialisation failed:', err);
    res.status(503).json({ success: false, message: 'Service temporarily unavailable. DB connection failed.' });
  }
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'Eventra',
    description: 'College Event Management Platform',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error handling middleware
app.use(errorHandler);

// ─── Execution mode ────────────────────────────────────────────────────────
// When running locally (`node src/server.js` or `npm run dev`) we start the
// HTTP server normally.  When deployed to Vercel the file is imported as a
// serverless function handler, so we must NOT call app.listen() — instead we
// just export the app and let Vercel invoke it per request.
// ───────────────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`Eventra API Server is live!`);
    console.log(`Port: ${PORT}`);
    console.log(`Health Check: http://localhost:${PORT}/api/health`);
    console.log(`Public Events: http://localhost:${PORT}/api/events`);
    console.log(`====================================================`);
  });
}

// Export for Vercel serverless function
module.exports = app;
