import React, { useState } from "react";
import { API_URL } from "../config";

const AddSale = ({ onSaleAdded }) => {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/sales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, amount: parseFloat(amount) }),
    });
    const data = await response.json();
    onSaleAdded(data);
    setProduct("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={product} onChange={e => setProduct(e.target.value)} placeholder="Product" required />
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" required />
      <button type="submit">Add Sale</button>
    </form>
  );
};

export default AddSale;
