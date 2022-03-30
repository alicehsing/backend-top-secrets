const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Secret = require('../models/Secret')

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    const secrets = await Secret.getAll();
    res.send(secrets);
  });
