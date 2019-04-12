var jwt = require('jsonwebtoken');

module.exports.tokenCheck = function (req, res, next) {
    var token = req.headers.auth;
    if(token){
        console.log("Verifying auth token => Start");
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
                next();
            }
        });
    }else{
        console.log("Request hasn't got Auth token");
        res.status(403).json({"message": "failed"});
    }
}