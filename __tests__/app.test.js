const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

// create an "agent" to give us the ability to store cookies between requests
const agent = request.agent(app);

describe('backend-top-secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('registers a user via POST', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({ email: 'momothecow@momo.com', password: 'iliketoeatgrass' });

    expect(res.body).toEqual({ 
      id: expect.any(String), 
      email: 'momothecow@momo.com' });
  });

  it('logs in an existing user', async () => {
    const user = await UserService.create({
      email: 'momothecow@momo.com',
      password: 'iliketoeatgrass',
    });

    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'momothecow@momo.com', password: 'iliketoeatgrass' });

    expect(res.body).toEqual({ 
      message: 'You have signed in successfully!',
      user,
    });
  });

  it('logs out a user via DELETE', async () => {

    const res = await agent.delete('/api/v1/users/sessions');

    expect(res.body).toEqual({ 
      success: true,
      message: 'You are logged out successfully!'
    });
  });
});
