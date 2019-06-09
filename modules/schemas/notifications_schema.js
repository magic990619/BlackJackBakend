var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var notificationSchema = new Schema({
  user_id: Number,
  title: String,
  notification: String,
  read: {
      type: Boolean,
      default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
},{
  usePushEach : true
});

module.exports = mongoose.model('data_notifications', notificationSchema);
