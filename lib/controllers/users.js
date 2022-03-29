const { Router } = require('express');
const UserService = require('../services/UserService');

module.exports = Router()
  .post('/sessions', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.send(user);
    } catch (error) {
      next(error);
    }
  });
