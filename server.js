const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from /public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// 404 JSON handler for unhandled API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

// Fallback for SPA/direct navigation to index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Central error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack || err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'An unexpected internal server error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚀 Simple E-commerce Store Server running`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`========================================`);
});
