const request = require('supertest');
const app = require('../server');

describe('Integration Tests - Sales Flow', () => {
  it('should complete full sales workflow', async () => {
    // 1. Get initial sales list
    const initialRes = await request(app).get('/sales');
    const initialCount = initialRes.body.length;

    // 2. Create a new sale
    const newSale = {
      item: 'Integration Test Item',
      quantity: 5,
      price: 25.99,
      date: new Date().toISOString()
    };

    const createRes = await request(app)
      .post('/sales')
      .send(newSale);

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body).toHaveProperty('id');
    const saleId = createRes.body.id;

    // 3. Verify sale appears in list
    const listRes = await request(app).get('/sales');
    expect(listRes.body.length).toBeGreaterThan(initialCount);
    
    const createdSale = listRes.body.find(s => s.id === saleId);
    expect(createdSale).toBeDefined();
    expect(createdSale.item).toBe(newSale.item);
  });

  it('should handle multiple concurrent sales', async () => {
    const sales = [
      { item: 'Concurrent 1', quantity: 1 },
      { item: 'Concurrent 2', quantity: 2 },
      { item: 'Concurrent 3', quantity: 3 }
    ];

    const promises = sales.map(sale => 
      request(app).post('/sales').send(sale)
    );

    const results = await Promise.all(promises);

    results.forEach((res, index) => {
      expect(res.statusCode).toBe(201);
      expect(res.body.item).toBe(sales[index].item);
    });

    // Verify all sales are in the list
    const listRes = await request(app).get('/sales');
    sales.forEach(sale => {
      const found = listRes.body.find(s => s.item === sale.item);
      expect(found).toBeDefined();
    });
  });
});

