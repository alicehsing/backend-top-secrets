const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');


describe('backend-top-secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  // POST { email, password } to /api/v1/users to create a new user
  it('creates a new user', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({ email: 'momothecow@momo.com', password: 'iliketoeatgrass' });

    expect(res.body).toEqual({ 
      id: expect.any(String), 
      email: 'momothecow@momo.com' });
  });

  // POST { email, password } to /api/v1/users as an signed-in user
  it('signs in an existing user', async () => {
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

  // DELETE signed in user from /api/v1/users/sessions 
  it('logs out a user via DELETE', async () => {
    const agent = request.agent(app);
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
    const res2 = await agent.delete('/api/v1/users/sessions');

    expect(res2.body).toEqual({ 
      success: true,
      message: 'You are logged out successfully!'
    });
  });

  // GET /api/v1/secrets so that signed in users can view a list of secrets
  it('should return a list of secrets if signed in as a user', async () => {
    const agent = request.agent(app);
    await UserService.create({
      email: 'momothecow@momo.com',
      password: 'iliketoeatgrass',
    });

    // Test authentication for the endpoint
    // No user signed in
    let res = await agent.get('/api/v1/secrets');
    // should get an "unauthenticated" 401 status
    expect(res.status).toEqual(401);

    // Authenticate an authenticated user
    await agent
      .post('/api/v1/users/sessions')
      .send({ 
        email: 'momothecow@momo.com',
        password: 'iliketoeatgrass'
      });
    
    // GET /api/v1/secrets to return a list of secrets
    res = await agent.get('/api/v1/secrets');

    // expect to return a secret for a sign in user  
    expect(res.body).toEqual([{
      createdAt: expect.any(String),
      description: 'Are you sure you want to know?',
      id: expect.any(String),
      title: 'Top Secrets'
    }]);
  });
});
