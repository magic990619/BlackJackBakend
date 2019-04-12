var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var AccountSchema = require('../modules/schemas/account_schema.js');
var bcrypt = require('bcryptjs');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
    console.log(email + ':' + password);
    AccountSchema.findOne({ email: email }, function (err, user) {
      console.log(email);
      if (err) { return done(err); }
      // Return if user not found in database
      if (!user) {
        return done(null, false, {
          message: 'Email or password is wrong!'
        });
      }
      // Return if password is wrong
      if (user && !bcrypt.compareSync(password, user.password)) {
        return done(null, false, {
          message: 'Password is wrong!'
        });
      }
      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));