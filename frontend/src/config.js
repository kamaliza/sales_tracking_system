// src/components/SalesList.js
import React, { useEffect, useState } from "react";
import { API_URL } from "../config";  // Import the URL

const SalesList = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/sales`)  // Use API_URL here
      .then((response) => response.json())
      .then((data) => setSales(data))
      .catch((error) => console.error("Error fetching sales:", error));
  }, []);

  return (
    <div>
      <h2>Sales List</h2>
      <ul>
        {sales.map((sale) => (
          <li key={sale.id}>{sale.product}: {sale.amount}</li>
        ))}
      </ul>
    </div>
  );
};

export default SalesList;

