var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var rewardsSchema = new Schema({
  day: {
    type: Number,
  },
  amount: {
    type: Number,
  },
  created_at:{
    type: Date,
    default: Date.now
  }
},{
  usePushEach : true
});

rewardsSchema.plugin(autoIncrement.plugin, 'data_rewards');

module.exports = mongoose.model('data_rewards', rewardsSchema);