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
let nextId = 1;

app.get('/sales', (req, res) => res.json(sales));

app.get('/sales/:id', (req, res) => {
  const sale = sales.find(s => s.id === parseInt(req.params.id));
  if (!sale) return res.status(404).json({ error: 'Sale not found' });
  res.json(sale);
});

app.post('/sales', (req, res) => {
  const { product, amount, date, customer } = req.body;
  const sale = { 
    id: nextId++, 
    product: product || 'Unknown',
    amount: parseFloat(amount) || 0,
    date: date || new Date().toISOString(),
    customer: customer || 'Unknown'
  };
  sales.push(sale);
  res.status(201).json(sale);
});

app.put('/sales/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = sales.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Sale not found' });
  
  const { product, amount, date, customer } = req.body;
  sales[index] = {
    ...sales[index],
    product: product !== undefined ? product : sales[index].product,
    amount: amount !== undefined ? parseFloat(amount) : sales[index].amount,
    date: date !== undefined ? date : sales[index].date,
    customer: customer !== undefined ? customer : sales[index].customer
  };
  res.json(sales[index]);
});

app.delete('/sales/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = sales.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Sale not found' });
  
  sales.splice(index, 1);
  res.status(204).send();
});

module.exports = app;

