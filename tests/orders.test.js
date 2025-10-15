const request = require('supertest');
const app = require('../app');

describe('Orders GET', () => {
  it('GET /orders returns 200 and array', async () => {
    const res = await request(app).get('/orders');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  }, 10000);
});
