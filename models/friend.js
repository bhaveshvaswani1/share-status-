const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  friend: {
    type: String,
    required: true
  }
});

const friend = mongoose.model('friend', friendSchema);

module.exports = friend;
