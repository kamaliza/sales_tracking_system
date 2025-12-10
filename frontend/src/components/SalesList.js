import React, { useState } from "react";
import { API_URL } from "../config";
import EditSale from "./EditSale";

const SalesList = ({ sales, onUpdate }) => {
  const [editingSale, setEditingSale] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale? This action cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`${API_URL}/sales/${id}`, { 
        method: "DELETE" 
      });
      
      if (response.ok) {
        onUpdate();
      } else {
        alert("Failed to delete sale");
      }
    } catch (err) {
      console.error("Failed to delete sale", err);
      alert("Failed to delete sale. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
  };

  const filteredSales = sales.filter(sale => {
    const searchLower = searchTerm.toLowerCase();
    return (
      sale.product?.toLowerCase().includes(searchLower) ||
      sale.customer?.toLowerCase().includes(searchLower) ||
      sale.id.toString().includes(searchLower)
    );
  });

  if (sales.length === 0) {
    return (
      <div className="sales-list-container">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No Sales Yet</h3>
          <p>Start tracking your sales by adding your first sale!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sales-list-container">
      {editingSale && (
        <EditSale
          sale={editingSale}
          onClose={() => setEditingSale(null)}
          onSave={() => {
            onUpdate();
            setEditingSale(null);
          }}
        />
      )}

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search by product, customer, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="btn-clear-search"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Sales Table */}
      <div className="table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-results">
                  No sales found matching "{searchTerm}"
                </td>
              </tr>
            ) : (
              filteredSales.map((sale) => (
                <tr key={sale.id} className={deletingId === sale.id ? "deleting" : ""}>
                  <td className="id-cell">#{sale.id}</td>
                  <td className="product-cell">
                    <strong>{sale.product || "Unknown"}</strong>
                  </td>
                  <td className="customer-cell">{sale.customer || "Unknown"}</td>
                  <td className="amount-cell">
                    <span className="amount-value">
                      ${parseFloat(sale.amount || 0).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </td>
                  <td className="date-cell">
                    {new Date(sale.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="actions-cell">
                    <button
                      onClick={() => handleEdit(sale)}
                      className="btn btn-warning btn-sm"
                      title="Edit sale"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sale.id)}
                      className="btn btn-danger btn-sm"
                      disabled={deletingId === sale.id}
                      title="Delete sale"
                    >
                      {deletingId === sale.id ? "⏳..." : "🗑️ Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {searchTerm && filteredSales.length > 0 && (
        <div className="search-summary">
          Showing {filteredSales.length} of {sales.length} sales
        </div>
      )}
    </div>
  );
};

export default SalesList;
