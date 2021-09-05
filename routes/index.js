const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const post = require('../models/post');
const user = require('../models/User');
// Welcome Page
router.get('/', (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res,next) =>{

  post.
  find()
  .then(item =>{
  res.render('dashboard', {user: req.user, post:item})
  });
});

module.exports = router;
