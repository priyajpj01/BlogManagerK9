const bcrypt = require("bcryptjs");
const User = require("../models/user");
const log = require("loglevel");
module.exports = {
 
  createUsers: async (userData) => {
    const existing = await User.findOne({ email: userData.email });

    if (existing)
      throw new Error(` A user with email ${userData.email} already exists`);
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (e) {
      return e.message;
    }
  },

  findByCredentials: async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error(`User with email ${email} does not exist, please signup`);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error(`Please enter valid password, password does not match`);
    }

    return user;
  },
};
