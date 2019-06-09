var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var contestsSchema = new Schema({
  game_id: {
    type: Number,
    default: 0
  },
  contest_name: {
    type: String,
    required: true
  },
  contest_type: {
    type: String
  },
  entry_fee: {
    type: Number
  },
  contest_goal: {
    type: Number
  },
  contest_rewards: {
    type: Number
  },
  start_time: {
    type: String
  },
  end_time: {
    type: String
  },
  contest_description: {
    type: String
  },
  created_at:{
    type: Date,
    default: Date.now
  }
},{
  usePushEach : true
});

contestsSchema.plugin(autoIncrement.plugin, 'data_contests');

module.exports = mongoose.model('data_contests', contestsSchema);