const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Sales Tracking Backend is running!');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Sales routes
let sales = [];

app.get('/sales', (req, res) => res.json(sales));
app.post('/sales', (req, res) => {
  const sale = { id: sales.length + 1, ...req.body };
  sales.push(sale);
  res.status(201).json(sale);
});

module.exports = app;

