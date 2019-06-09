var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var ContestsDataSchema = new Schema({
    account_id: Number,
    contest_id: Number,
    user_score: Number,
    winner_status: Boolean,
    winner_date: String,
},{
  usePushEach : true
});

ContestsDataSchema.plugin(autoIncrement.plugin, 'data_contest_user');

module.exports = mongoose.model('data_contest_user', ContestsDataSchema);