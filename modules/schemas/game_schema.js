var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var gamesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true
  },
  created_at:{
    type: Date,
    default: Date.now
  }
},{
  usePushEach : true
});

gamesSchema.plugin(autoIncrement.plugin, 'base_games');

module.exports = mongoose.model('base_games', gamesSchema);