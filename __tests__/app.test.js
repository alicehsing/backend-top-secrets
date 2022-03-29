const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('backend-top-secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('registers a user via POST', async () => {
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'momothecow@momo.com', password: 'iliketoeatgrass' });

    expect(res.body).toEqual({ 
      id: expect.any(String), 
      email: 'momothecow@momo.com' });
  });

});
