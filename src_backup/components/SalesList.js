import React, { useState, useEffect } from "react";
import { API_URL } from "../config";
import EditSale from "./EditSale";

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [editingSale, setEditingSale] = useState(null);

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API_URL}/sales`);
      const data = await res.json();
      setSales(data);
    } catch (err) {
      console.error("Failed to fetch sales", err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;

    try {
      await fetch(`${API_URL}/sales/${id}`, { method: "DELETE" });
      fetchSales();
    } catch (err) {
      console.error("Failed to delete sale", err);
    }
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>All Sales</h2>

      {editingSale && (
        <EditSale
          sale={editingSale}
          onClose={() => setEditingSale(null)}
          onSave={fetchSales}
        />
      )}

      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "left"
      }}>
        <thead style={{ backgroundColor: "#007BFF", color: "#fff" }}>
          <tr>
            <th style={{ padding: "10px" }}>ID</th>
            <th style={{ padding: "10px" }}>Product</th>
            <th style={{ padding: "10px" }}>Amount</th>
            <th style={{ padding: "10px" }}>Date</th>
            <th style={{ padding: "10px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px" }}>{sale.id}</td>
              <td style={{ padding: "10px" }}>{sale.product}</td>
              <td style={{ padding: "10px" }}>{sale.amount}</td>
              <td style={{ padding: "10px" }}>{new Date(sale.date).toLocaleString()}</td>
              <td style={{ padding: "10px" }}>
                <button
                  onClick={() => handleEdit(sale)}
                  style={{
                    marginRight: "10px",
                    padding: "5px 10px",
                    backgroundColor: "#ffc107",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(sale.id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesList;
