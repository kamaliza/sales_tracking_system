const request = require('supertest');

describe('Health Check Endpoint', () => {
  let app;
  
  beforeEach(() => {
    // Clear module cache to reload server with fresh environment
    delete require.cache[require.resolve('../server')];
    app = require('../server');
  });

  it('should return 200 and health status', async () => {
    const res = await request(app).get('/health');
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toBe('healthy');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('uptime');
    expect(typeof res.body.uptime).toBe('number');
  });

  it('should include environment information', async () => {
    const res = await request(app).get('/health');
    
    expect(res.body).toHaveProperty('environment');
    expect(['development', 'test', 'production']).toContain(res.body.environment);
  });

  it('should default to development when NODE_ENV is not set', async () => {
    const originalEnv = process.env.NODE_ENV;
    delete process.env.NODE_ENV;
    
    // Reload server module
    delete require.cache[require.resolve('../server')];
    const testApp = require('../server');
    
    const res = await request(testApp).get('/health');
    expect(res.body.environment).toBe('development');
    
    // Restore original env
    if (originalEnv) {
      process.env.NODE_ENV = originalEnv;
    }
  });

  it('should use NODE_ENV when set', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    // Reload server module
    delete require.cache[require.resolve('../server')];
    const testApp = require('../server');
    
    const res = await request(testApp).get('/health');
    expect(res.body.environment).toBe('production');
    
    // Restore original env
    process.env.NODE_ENV = originalEnv || 'test';
    
    // Reload again to restore
    delete require.cache[require.resolve('../server')];
    require('../server');
  });
});

