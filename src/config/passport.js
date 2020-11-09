const LocalStategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');


// load User model
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new LocalStategy({ usernameField: 'email' }, (email, password, done) => {
      // match user
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: 'This email is not registered',
            });
          }
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user); // null: err, user: user
            } else {
              return done(null, false, { message: 'Password incorrected' });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
