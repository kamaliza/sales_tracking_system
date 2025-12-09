import React, { useState, useEffect } from "react";
import { API_URL } from "../config";

const EditSale = ({ sale, onClose, onSave }) => {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (sale) {
      setProduct(sale.product);
      setAmount(sale.amount);
    }
  }, [sale]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/sales/${sale.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, amount }),
      });
      if (res.ok) {
        onSave();   // refresh list
        onClose();  // close modal
      } else {
        alert("Failed to update sale");
      }
    } catch (err) {
      console.error("Error updating sale:", err);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <form 
        onSubmit={handleSubmit} 
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          minWidth: "350px",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)"
        }}
      >
        <h3 style={{ marginBottom: "20px", textAlign: "center" }}>Edit Sale</h3>

        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Product"
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Save
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSale;

