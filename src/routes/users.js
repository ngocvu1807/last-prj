const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// load user model
const User = require('../models/User');
// const {forwardAuthenticated} = require()

// Login page
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login | Meet App',
    layout: 'login',
  });
});

// Register page
router.get('/register', (req, res) => {
  res.render('register', { title: ' Sign Up | New Account', layout: 'login' });
});

// Register handle
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  let errors = [];

  // requrie fields
  if (!name || !email || !password) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  // check pasword length
  if (password.length < 6) {
    errors.push({ msg: 'Password should be atleast 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      title: ' Sign Up | New Account',
      layout: 'login',
      errors,
      name,
      email,
      password,
    });
  } else {
    // Validation
    User.findOne({ email: email }).then((user) => {
      if (user) {
        // USer exist
        errors.push({ msg: 'Email is already registered' });
        res.render('register', {
          title: ' Sign Up | New Account',
          layout: 'login',
          errors,
          name,
          email,
          password,
        });
      } else {
        const newUser = new User({
          name: name,
          email,
          password,
        });
        // hash password
        console.log(newUser);
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            // Set password to hashed
            newUser.password = hash;
            // save user
            newUser
              .save()
              .then((user) => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/login');
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
  // console.log(req.body);
  errors.forEach((e) => console.log(e.msg));
});

// Login handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: 'Homepage',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
});

module.exports = router;
