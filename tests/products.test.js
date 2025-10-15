const request = require('supertest');
const app = require('../app');

describe('Products GET', () => {
  it('GET /products returns 200 and array', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  }, 10000);
});
