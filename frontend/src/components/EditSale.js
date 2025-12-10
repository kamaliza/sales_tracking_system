import React, { useState, useEffect } from "react";
import { API_URL } from "../config";

const EditSale = ({ sale, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    product: "",
    amount: "",
    customer: "",
    date: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sale) {
      const saleDate = sale.date ? new Date(sale.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      setFormData({
        product: sale.product || "",
        amount: sale.amount || "",
        customer: sale.customer || "",
        date: saleDate
      });
    }
  }, [sale]);

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
      const response = await fetch(`${API_URL}/sales/${sale.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: formData.product,
          amount: parseFloat(formData.amount),
          customer: formData.customer || "Unknown",
          date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update sale");
      }

      onSave();
    } catch (err) {
      setError(err.message || "Failed to update sale. Please try again.");
      console.error("Error updating sale:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Edit Sale #{sale.id}</h3>
          <button className="modal-close" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="sale-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="edit-product" className="form-label">
                Product Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="edit-product"
                name="product"
                value={formData.product}
                onChange={handleChange}
                placeholder="Enter product name"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-amount" className="form-label">
                Amount ($) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="edit-amount"
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
              <label htmlFor="edit-customer" className="form-label">
                Customer Name
              </label>
              <input
                type="text"
                id="edit-customer"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                placeholder="Enter customer name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-date" className="form-label">
                Sale Date
              </label>
              <input
                type="date"
                id="edit-date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? "Saving..." : "💾 Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSale;
