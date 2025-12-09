import React, { useState, useEffect } from "react";
import { API_URL } from "../config";
import EditSale from "./EditSale"; // Make sure this file exists

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [editingSale, setEditingSale] = useState(null); // state to handle edit modal

  // Fetch all sales from backend
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

  // Delete a sale
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/sales/${id}`, { method: "DELETE" });
      fetchSales(); // refresh list
    } catch (err) {
      console.error("Failed to delete sale", err);
    }
  };

  // Open edit modal
  const handleEdit = (sale) => {
    setEditingSale(sale);
  };

  return (
    <div>
      <h2>All Sales</h2>

      {/* Edit Sale Modal */}
      {editingSale && (
        <EditSale
          sale={editingSale}
          onClose={() => setEditingSale(null)}
          onSave={fetchSales} // refresh after editing
        />
      )}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{sale.product}</td>
              <td>{sale.amount}</td>
              <td>{new Date(sale.date).toLocaleString()}</td>
              <td>
                <button onClick={() => handleEdit(sale)}>Edit</button>
                &nbsp;
                <button onClick={() => handleDelete(sale.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesList;

