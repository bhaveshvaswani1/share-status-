const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const friend = require('../models/friend')
const post = require('../models/post');
const { forwardAuthenticated,ensureAuthenticated } = require('../config/auth');
var path = require('path')

const app  = express();
router.use('public', express.static('public'))

//static files
app.use('/public',express.static('public'));
const multer  = require('multer')
  const fileFilter=(req, file, cb)=>{
      if(file.mimetype ==='image/jpeg' ||file.mimetype ==='image/mkv'|| file.mimetype ==='image/gif' || file.mimetype ==='image/jpg' || file.mimetype ==='image/png'){
        console.log(file.mimetype);
        cb(null,true);
    }
   else if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) { 
        return cb(new Error('Please upload a video'))
     }
     cb(undefined, true)
  }
const videoStorage = multer.diskStorage({
    destination: './public/uploads/', // Destination to store video 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
});
var upload = multer({ 
    storage:videoStorage,
    limits:{
        fileSize:10000000
    },
    fileFilter:fileFilter
 }).single('file');
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

router.post('/edit/:id',upload,ensureAuthenticated, (req, res) =>{
    
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
router.post('/', upload,ensureAuthenticated, async (req, res,next) => {
    
    newPost = {
      
        username: req.user.username,
        title: req.body.title,
        status:req.body.status,
        image:req.file.filename
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
