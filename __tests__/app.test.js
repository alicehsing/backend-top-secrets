const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');


// Dummy user for testing
const dummyUser = {
  email: 'momothecow@momo.com',
  password: 'iliketoeatgrass',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? dummyUser.password;

  // create an "agent" to give us the ability to store cookies between requests
  const agent = request.agent(app);

  // create a user to sign in with
  const user = await UserService.create({ ...dummyUser, ...userProps });

  // ...then sign in
  const { email } = user;
  await agent
    .post('/api/v1/users/sessions')
    .send({ email, password });
  return [agent, user];
};

describe('backend-top-secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a new user', async () => {
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

    // Authenticate a user that is authorized
    await agent
      .post('/api/v1/users/sessions')
      .send({ 
        email: 'momothecow@momo.com',
        password: 'iliketoeatgrass'
      });
    res = await agent.get('/api/v1/secrets');
    // should get a successful 200 response
    expect(res.status).toEqual(200);
  });
});
