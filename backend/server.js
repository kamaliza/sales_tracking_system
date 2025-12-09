// ~/sales_tracking_system/backend/server.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());            // allow requests from frontend
app.use(bodyParser.json()); // parse JSON body

// --- Root route ---
app.get("/", (req, res) => {
  res.send("Sales Tracking Backend is running!");
});

// In-memory sales data (replace with database later)
let sales = [
  { id: 1, product: "Product A", amount: 100, date: new Date() },
  { id: 2, product: "Product B", amount: 200, date: new Date() },
];

// --- API Routes ---

// Get all sales
app.get("/sales", (req, res) => {
  res.json(sales);
});

// Get a single sale
app.get("/sales/:id", (req, res) => {
  const sale = sales.find(s => s.id === parseInt(req.params.id));
  if (!sale) return res.status(404).json({ message: "Sale not found" });
  res.json(sale);
});

// Create a new sale
app.post("/sales", (req, res) => {
  const { product, amount } = req.body;
  const newSale = {
    id: sales.length + 1,
    product,
    amount,
    date: new Date()
  };
  sales.push(newSale);
  res.status(201).json(newSale);
});

// Update a sale
app.put("/sales/:id", (req, res) => {
  const sale = sales.find(s => s.id === parseInt(req.params.id));
  if (!sale) return res.status(404).json({ message: "Sale not found" });

  const { product, amount } = req.body;
  sale.product = product;
  sale.amount = amount;
  res.json(sale);
});

// Delete a sale
app.delete("/sales/:id", (req, res) => {
  const index = sales.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Sale not found" });

  sales.splice(index, 1);
  res.json({ message: "Sale deleted" });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});

