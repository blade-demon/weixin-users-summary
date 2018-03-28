var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  "unionid": String,
  "headimg": String,
  "nickname": String,
  "scoreRecords": [{
    "recordType": {
      type: Number,
      enum: [0, 1, 2],
      default: 1
      // 1 评论， 2分享，3兑换
    },
    "date": {
      type: Date,
      default: Date.now
    },
    "score": {
      type: Number,
      default: 0
    }
  }]
});

module.exports = mongoose.model('User', UserSchema);