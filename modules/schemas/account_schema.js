var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken');

autoIncrement.initialize(mongoose.connection);

var accountSchema = new Schema({
  user_name: {
    type: String,
    default: "Player"
  },
  email: { 
    type: String,
    required: true
  },
  password: {
    type: String,
    required : true
  },
  security_question: {
    type: String,
  },
  security_answer: {
    type: String,
  },
  role: {
    type: String,
    default: "user"
  },
  avatar: String,
  credit: {
    type: Number,
    default: 10000
  },
  won_credit: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  devices: [
    {
      device_type: String
    }
  ],
  account_status: {
    type: String,
    default: "Active"
  },
  is_online: Boolean,
  last_rewarded_time: {
    type: String,
  },
  reward_day: {
    type: Number,
    default: 1
  },
  today_rewarded: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
},{
  usePushEach : true
});

accountSchema.plugin(autoIncrement.plugin, 'data_accounts');
accountSchema.plugin(passportLocalMongoose);

accountSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setHours(expiry.getHours() + 4);

  return jwt.sign({
    userId: this._id,
    userName: this.user_name,
    email: this.email,
    credit : this.credit,
    role: this.role,
    exp: parseInt(expiry.getTime() / 1000),
  }, "bAKVdqczerYAYKdMxsaBzbFUJU6ZvL2LwZuxhtpS");
};

module.exports = mongoose.model('data_accounts', accountSchema);