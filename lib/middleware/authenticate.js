const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    // get the value from the cookie (jwt)
    const session = req.cookies.session;
    // verify the jwt
    const payload = jwt.verify(session, process.env.JWT_SECRET);

    req.user = payload;

    next();
  } catch (error) {
    error.message = 'You must be signed in to continue.';
    error.status = 401;
    next(error);
  }
};
