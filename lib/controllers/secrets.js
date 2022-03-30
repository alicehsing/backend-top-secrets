const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Secret = require('../models/Secret')

module.exports = Router()

  // GET /api/v1/secrets
  .get('/', authenticate, async (req, res) => {
    const secrets = await Secret.getAll();
    res.send(secrets);
  })

  // POST { title, description } to /api/v1/secrets
  .post('/', authenticate, async (req, res, next) => {
    try {
      const { title, description } = req.body;
      const secret = await Secret.insert({
        title,
        description,
      });

      res.send(secret);
    } catch (error) {
      next(error);
    }
  });
