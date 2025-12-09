// tests/sales.test.js
const { addSale } = require('../server'); // adjust path if needed

describe('Sales Module', () => {
  test('should add a sale with an id', () => {
    const sale = { item: 'Apple', quantity: 10 };
    const result = addSale(sale);
    expect(result).toHaveProperty('id');
  });
});

// tests/api.test.js
const request = require('supertest');
const app = require('../server'); // Express app

describe('GET /sales', () => {
  it('should return 200 and sales list', async () => {
    const res = await request(app).get('/sales');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
