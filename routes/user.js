var express = require('express');
var router = express.Router();
var adminhelper = require('../helpers/admin-helper');
var userhelper = require('../helpers/user-helper');
router.use(express.urlencoded({ extended: true }));

/* GET users listing. */
router.get('/', function (req, res, next) {
  let user = req.session.user;
  console.log(user);
  res.render('user', { user });

});

router.get('/signup', (req, res) => {
  if (req.session.user && req.session.user.loggedIn) {
    res.redirect('/');
  } else {
    res.render('user/signup');
  }
});

router.post('/signup', (req, res) => {
  adminhelper.adduser(req.body, (err, result) => {
    if (!err) {
      res.render('user/signup');
    } else {
      console.log(err);
    }
  });
});

router.get('/signin', (req, res) => {
  if (req.session.user && req.session.user.loggedIn) {
    res.redirect('/');
  } else {
    res.render('user/signin');
  }
});

router.post('/signin', (req, res) => {
  userhelper.dologin(req.body).then((response) => {
    if (response.status) {
      // Initialize req.session.user if it doesn't exist
      req.session.user = req.session.user || {};
      req.session.user.loggedIn = true;
      req.session.user.user = response.user;

      res.redirect('/');
    } else {
      res.redirect('/signin');
    }
  });
});

router.get('/logout', (req, res) => {
  req.session.user = null;
  res.redirect('/signin');
});  



module.exports = router;
