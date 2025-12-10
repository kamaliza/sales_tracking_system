import React, { useState } from "react";
import { API_URL } from "../config";

const AddSale = ({ onSaleAdded }) => {
  const [formData, setFormData] = useState({
    product: "",
    amount: "",
    customer: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.product || !formData.amount) {
      setError("Product and Amount are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: formData.product,
          amount: parseFloat(formData.amount),
          customer: formData.customer || "Unknown",
          date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add sale");
      }

      const data = await response.json();
      onSaleAdded(data);
      
      // Reset form
      setFormData({
        product: "",
        amount: "",
        customer: "",
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      setError(err.message || "Failed to add sale. Please try again.");
      console.error("Error adding sale:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-sale-form">
      <h3 className="form-title">Add New Sale</h3>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="sale-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="product" className="form-label">
              Product Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="product"
              name="product"
              value={formData.product}
              onChange={handleChange}
              placeholder="Enter product name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Amount ($) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="customer" className="form-label">
              Customer Name
            </label>
            <input
              type="text"
              id="customer"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              placeholder="Enter customer name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date" className="form-label">
              Sale Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary btn-submit"
            disabled={loading}
          >
            {loading ? "Adding..." : "➕ Add Sale"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSale;
