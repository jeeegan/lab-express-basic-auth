const express = require('express');
const router = express.Router();

const User = require('../models/User.model');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({"username": username})
    .then(user => {
      if(user !== null) {
        res.render('/', {
          errorMessage: "User already exists!"
        });
        return;
      } 

      const salt = bcrypt.genSaltSync(bcryptSalt);

      const newUser = new User ({
        username: username,
        password: bcrypt.hashSync(password, salt)
      });

      newUser.save()
        .then(() => res.redirect('/'))
        .catch(e => console.log(`Error creating user ${e}`))
    })
});

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  const salt = bcrypt.genSaltSync(bcryptSalt);

  User.findOne({"username": username})
    .then(user => {
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        res.redirect('/');
      }
    })
});

module.exports = router;