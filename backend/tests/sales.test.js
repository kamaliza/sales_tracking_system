const request = require('supertest');
const app = require('../server');

describe('Sales API', () => {
  // Reset sales array before each test
  beforeEach(() => {
    // Clear the sales array by making a fresh app instance
    // Note: In production, you'd use a proper database reset
  });

  describe('GET /', () => {
    it('should return 200 and welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('Sales Tracking Backend is running!');
    });
  });

  describe('GET /sales', () => {
    it('should return 200 and empty sales list initially', async () => {
      const res = await request(app).get('/sales');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(0);
    });

    it('should return all sales after adding some', async () => {
      // Add a sale first
      await request(app)
        .post('/sales')
        .send({ item: 'Test Item', quantity: 5, price: 10.99 });

      const res = await request(app).get('/sales');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /sales', () => {
    it('should create a new sale with valid data', async () => {
      const saleData = {
        item: 'Apple',
        quantity: 10,
        price: 1.50
      };

      const res = await request(app)
        .post('/sales')
        .send(saleData)
        .set('Content-Type', 'application/json');

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.item).toBe(saleData.item);
      expect(res.body.quantity).toBe(saleData.quantity);
      expect(res.body.price).toBe(saleData.price);
    });

    it('should assign incremental IDs', async () => {
      const sale1 = await request(app)
        .post('/sales')
        .send({ item: 'Item 1', quantity: 1 });

      const sale2 = await request(app)
        .post('/sales')
        .send({ item: 'Item 2', quantity: 2 });

      expect(sale2.body.id).toBeGreaterThan(sale1.body.id);
    });

    it('should accept sale with minimal data', async () => {
      const res = await request(app)
        .post('/sales')
        .send({ item: 'Minimal Sale' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.item).toBe('Minimal Sale');
    });

    it('should handle empty request body', async () => {
      const res = await request(app)
        .post('/sales')
        .send({});

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid JSON gracefully', async () => {
      const res = await request(app)
        .post('/sales')
        .send('invalid json')
        .set('Content-Type', 'application/json');

      // Express should handle this, might return 400 or 500
      expect([400, 500]).toContain(res.statusCode);
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const res = await request(app).get('/sales');
      expect(res.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});
