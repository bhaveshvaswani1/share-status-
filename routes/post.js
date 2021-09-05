const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const friend = require('../models/friend')
const post = require('../models/post');
const { forwardAuthenticated,ensureAuthenticated } = require('../config/auth');

// Login Page
router.get('/',ensureAuthenticated, (req, res) =>{
    res.render('post');
});

router.get('/myPosts',ensureAuthenticated, (req, res) =>{
    post.
  find()
  .then(item =>{
  res.render('MyPost', {user: req.user, post:item})
  });
});
router.get('/myfriend',ensureAuthenticated, (req, res) =>{
    friend.
  find({username:req.user.username})
  .then(item =>{
      
    post.find()
    .then(posts=>{
        res.render('myfriend', {user: req.user, friend:item, post:posts})

    })

  });
});
router.get('/edit/:id',ensureAuthenticated, (req, res) =>{
    post.
    findOne({_id:req.params.id})
    .then(item =>{
    res.render('edit', {user: req.user, post:item})
    });

});

router.post('/edit/:id',ensureAuthenticated, (req, res) =>{
    
    post.findByIdAndUpdate(req.params.id,req.body,function(err,post){

        if(err)
        {
            console.log(err);
        }
        else{
            res.redirect('/post/MyPosts');
        }
    });
});
router.post('/delete/:id',ensureAuthenticated, (req, res) =>{
    
    post.findByIdAndDelete(req.params.id,function(err){

            if(err)
            console.log(err);
            else{
                res.redirect('/post/MyPosts');
            }
    });
});
router.post('/',ensureAuthenticated, async (req, res,next) => {

    newPost = {
      
        username: req.user.username,
        title: req.body.title,
        status:req.body.status
    }
    var myData = new post(newPost);
    await  myData.save()
    .then(item =>{
        res.redirect('/dashboard');
    })
    .catch(err =>{
        res.send("not saved");
    });
    


 next();
});

module.exports = router;
