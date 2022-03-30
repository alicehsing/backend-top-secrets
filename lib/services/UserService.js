const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ email, password }) {
    const passwordHash = bcrypt.hashSync(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    return User.insert({
      email,
      passwordHash,
    });
  }

  static async signIn({ email, password }) {
    // check for existing user
    const user = await User.getUserByEmail(email);
    if (!user) throw new Error('invalid email/password');

    // if user exists, compare hashed password
    const passwordsMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!passwordsMatch) throw new Error('invalid email/password');

    // if passwords match, return user
    return user;
  }

  

};
