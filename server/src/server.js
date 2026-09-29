const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');
const seedData = require('./utils/seed');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true
  })
);
app.use(express.json());
app.use(morgan('dev'));

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

// Start server
const start = async () => {
  try {
    await connectDB();
    await seedData();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`Eventra API Server is live!`);
      console.log(`Port: ${PORT}`);
      console.log(`Health Check: http://localhost:${PORT}/api/health`);
      console.log(`Public Events: http://localhost:${PORT}/api/events`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
