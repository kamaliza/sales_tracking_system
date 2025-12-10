import React, { useState, useEffect } from 'react';
import './App.css';
import SalesList from './components/SalesList';
import AddSale from './components/AddSale';
import { API_URL } from './config';

function App() {
  const [sales, setSales] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API_URL}/sales`);
      const data = await res.json();
      setSales(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch sales', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleSaleAdded = () => {
    fetchSales();
    setShowAddForm(false);
  };

  // Calculate statistics
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + (parseFloat(sale.amount) || 0), 0);
  const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    const today = new Date();
    return saleDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="App">
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">
            <span className="icon">📊</span>
            Sales Tracking System
          </h1>
          <p className="app-subtitle">Manage your sales efficiently</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card stat-card-primary">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3 className="stat-label">Total Revenue</h3>
                <p className="stat-value">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
            <div className="stat-card stat-card-success">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <h3 className="stat-label">Total Sales</h3>
                <p className="stat-value">{totalSales}</p>
              </div>
            </div>
            <div className="stat-card stat-card-info">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h3 className="stat-label">Average Sale</h3>
                <p className="stat-value">${averageSale.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
            <div className="stat-card stat-card-warning">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3 className="stat-label">Today's Sales</h3>
                <p className="stat-value">{todaySales}</p>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="action-bar">
            <h2 className="section-title">Sales Management</h2>
            <button 
              className="btn btn-primary btn-add"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? '✕ Cancel' : '+ Add New Sale'}
            </button>
          </div>

          {/* Add Sale Form */}
          {showAddForm && (
            <div className="form-container">
              <AddSale onSaleAdded={handleSaleAdded} />
            </div>
          )}

          {/* Sales List */}
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading sales...</p>
            </div>
          ) : (
            <SalesList sales={sales} onUpdate={fetchSales} />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2025 Sales Tracking System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
