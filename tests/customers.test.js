const request = require('supertest');
const app = require('../app');

describe('Customers GET', () => {
  it('GET /customers returns 200 and array', async () => {
    const res = await request(app).get('/customers');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  }, 10000);
});
