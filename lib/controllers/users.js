const { Router } = require('express');
const UserService = require('../services/UserService');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.send(user);
    } catch (error) {
      next(error);
    }
  })

  .post('/sessions', async (req, res, next) => {
    try {
      const user = await UserService.signIn(req.body);

      res
        .cookie(process.env.COOKIE_NAME, user.authToken(), {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .send({ message: 'You have signed in successfully!', user });
    } catch (error) {
      next(error);
    }
  })

  .delete('/sessions', async (req, res, next) => {
    try {
      res
        .clearCookie(process.env.COOKIE_NAME)
        .json({ success: true, message: 'You are logged out successfully!' });
    } catch (error) {
      next(error);
    }
  });


