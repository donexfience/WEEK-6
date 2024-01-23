var express = require('express');
var router = express.Router();
var adminhelper = require('../helpers/admin-helper');
router.use(express.urlencoded({ extended: true }));

const verifyLogin = (req, res, next) => {
  if (req.session.admin && req.session.admin.loggedIn) {
    next();
  } else {
    res.redirect('admin/adminlogin');
  }
};
router.use('/admin',verifyLogin );
router.get('/admin/adminlogout', (req, res) => {
  
  req.session.admin = null;
  
  res.redirect('/admin/adminlogin');
});
router.get('/',verifyLogin, function (req, res, next) {
  let admin = req.session.admin;
  adminhelper.getalluser().then((users) => {
    res.render('admin', { title: 'Express', users, admin });
  });
});

router.get('/add-user',verifyLogin, function (req, res) {
  res.render('admin/add-user');
});

router.post('/add-user', async (req, res) => {
  try {
    const result = await adminhelper.adduser(req.body);

    if (result.success) {
      res.render('admin/add-user');
    } else {
      console.log("Error adding user:", result.error);
      res.redirect('/admin');
    }
  } catch (error) {
    console.log("Unexpected error:", error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/adminlogin', (req, res) => {
  if (req.session.admin && req.session.admin.loggedIn) {
    res.redirect('/admin');
  } else {
    res.render('admin/login');
  }
});

router.post('/loginadmin', (req, res) => {
  adminhelper.dologin(req.body).then((response) => {
    if (response.status) {
      req.session.admin = req.session.admin || {};
      req.session.admin.loggedIn = true;
      req.session.admin.user = response.user;

      res.redirect('/admin');
    } else {
      res.redirect('/admin/adminlogin');
    }
  });
});





router.get('/delete-user/', verifyLogin, (req, res) => {
  let userId = req.query.id;
  console.log(userId);
  adminhelper.deleteuser(userId).then((Response) => {
    res.redirect('/admin');
  });
});

router.get('/edit-user/:id',verifyLogin, async (req, res) => {
  try {
    console.log("User ID:", req.params.id);
    let user = await adminhelper.getuserdetails(req.params.id);
    console.log("User Details:", user);
    res.render('admin/edit-user', { user });
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
});

router.post('/edit-user/:id', verifyLogin, (req, res) => {
  console.log("User ID from request:", req.params.id);
  adminhelper.updateuser(req.body, req.params.id)
    .then(() => {
      res.redirect('/admin');
    })
    .catch((error) => {
      console.error("Error updating user:", error);
      res.status(500).send("Error updating user");
    });
});

router.get('/search-users',verifyLogin, async (req, res) => {
  const query = req.query.query;
  const searchResults = await adminhelper.searchUsers(query);
  res.render('admin', { users: searchResults });
});

module.exports = router;
