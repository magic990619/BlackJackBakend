var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var questionsSchema = new Schema({
  question: {
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

questionsSchema.plugin(autoIncrement.plugin, 'base_questions');

module.exports = mongoose.model('base_questions', questionsSchema);