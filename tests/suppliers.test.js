const request = require('supertest');
const app = require('../app');

describe('Suppliers GET', () => {
  it('GET /suppliers returns 200 and array', async () => {
    const res = await request(app).get('/suppliers');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  }, 10000);
});
