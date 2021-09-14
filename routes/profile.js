const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');

const friend = require('../models/friend');

const post = require('../models/post');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');


router.get('/allUsers',ensureAuthenticated,async(req,res)=>{

  await  User.find()
    .then(item=>{
        console.log(item);
        res.render('allUsers',{data:item});
    })
});


router.get('/:username', ensureAuthenticated, async (req, res) => {

    let isFriend = false;
    friend.findOne({ username: req.user.username, friend: req.params.username }, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            if (docs)
                isFriend = true;
            else isFriend = false;

        }
    });
    await User.findOne({ username: req.params.username })
        .then(item => {
            if (item) {
                post.find({ username: req.params.username })
                    .then(posts => {
                        res.render('profile', { loginUser: req.user, user: item, post: posts, isFriend: isFriend });

                    })

            }
            else res.send("No user exist with this username");
        })
});
router.post('/addfriend', ensureAuthenticated, async (req, res, next) => {

    data = {
        username: req.user.username,
        friend: req.body.addfriend
    }
    const new_friend = new friend(data)
    await new_friend.save()
        .then(() => {
            var url1 = "/profile/" + data.friend;
            res.redirect(url1)
        })
        .catch(err => {
            console.log(data);
            res.send(err);
        });
    next()

})
router.post('/deletefriend', ensureAuthenticated, async (req, res, next) => {


    data = { username: req.user.username, friend: req.body.deletefriend };

    var id;
    await friend.findOne(data, function (err, res) {
        id = res._id;
    })

    await friend.findByIdAndDelete(id, async function (err) {

        if (err)
            console.log(err);
        else {
            var url1 = "/profile/" + data.friend;
            res.redirect(url1)

        }
    });


    next()

})

module.exports = router;
