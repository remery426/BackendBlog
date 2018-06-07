const mongoose = require('mongoose')
const User = mongoose.model('User');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(async function(username, password, done) {
  try {
    let user = await User.findOne({username:username});
    if (!user) {
      password = await bcrypt.hash(password,12)
      user = await new User({username:username,password:password});
      await user.save()
      return done(null,user)
    } else {
      let matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        return done(null, false)
      } else {
        return done(null, user);
      }
    }
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser(async function(user, done) {
  done(null, await user._id);
});

passport.deserializeUser(async function(id, done) {
  try {
    let user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});
