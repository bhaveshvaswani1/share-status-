const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  status: {
    type:String,
    required: true
  },
  image:{
    type:String
  }
});

const post = mongoose.model('post', PostSchema);

module.exports = post;
