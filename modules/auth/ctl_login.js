var AccountSchema = require('../schemas/account_schema.js');
var passport = require('passport');
var jwtDecode = require('jwt-decode');
var _tokenCheck = require('../../config/auth_token.js');
var jwt = require('jsonwebtoken');


module.exports.login = function (req, res) {

  passport.authenticate('local', function(err, user, info){
    var token;

    if (err) {
      console.log("passport error exception");
      res.status(401).json(err);
      return;
    }

    if(user){

      token = user.generateJwt();
      var decodedToken = jwtDecode(token);
      res.status(201);
      res.json({
        'access_token' : token,
        'decodedToken' : decodedToken
      });

    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

}

module.exports.access_token = function (req, res) {
  console.log("login with access_token");
  // console.log(req);
  try {
    var token = req.params.access_token;
    if(token){
        jwt.verify(token, 'bAKVdqczerYAYKdMxsaBzbFUJU6ZvL2LwZuxhtpS', function(err, decoded) {
            // console.log(decoded);
            if(err){
                if (err.name === "TokenExpiredError") {
                    console.log("Verifying auth token => Token Expired");
                    res.status(401).json({"message": "Verifying auth token => failed", "type": "token-exp"});
                } else {
                    console.log("Verifying auth token => Faild");
                    res.status(401).json({"message": "Verifying auth token => failed"});
                }
            }else{
                console.log("Verifying auth token => Success");
                var decodedToken = jwtDecode(token);
                res.status(201);
                res.json({
                  'access_token' : token,
                  'decodedToken' : decodedToken
                });
            }
        });
    }else{
      console.log("Request hasn't got Auth token");
      res.status(403).json({"message": "failed"});
    }
  } catch(err) {
    console.log(err);
  }
}