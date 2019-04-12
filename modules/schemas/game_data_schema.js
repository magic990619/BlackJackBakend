var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var gamesDataSchema = new Schema({
  account_id: Number,

      game_id: Number,
      total_winning: Number,
      total_wagered: Number,
      wining_percenet: Number,
      won_credit: Number,
      played_hand: Number,
      played_date: String,      // total played time in minutes
},{
  usePushEach : true
});

gamesDataSchema.plugin(autoIncrement.plugin, 'data_games');

module.exports = mongoose.model('data_games', gamesDataSchema);