const { Router } = require('express');

module.exports = Router()
  .get('/', async (req, res, next) => {
    try {
      const secrets = [
        {
          id: '1',
          title: 'Secret no one should know about',
          description: 'I can eat 10 bags of Doritos for lunch',
          created_at: ''
        },
      ];

      res.send(secrets);
    } catch (error) {
      next(error);
    }
  });
