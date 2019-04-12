var AccountSchema = require('../schemas/account_schema.js');

var jwt = require('jsonwebtoken');

var bcrypt = require('bcryptjs');

module.exports.register = async function (req, res) {
 
    try {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);

        var userInfo = {
            user_name: req.body.userName,
            email :     req.body.email || null,
            password:   hash,
            security_question   : req.body.security_question,
            security_answer     : req.body.security_answer,
            location            : req.body.location,
        }

        var accountDoc = await AccountSchema.findOne({'email': userInfo.email});
        if (accountDoc == null) {
            accountDoc = await AccountSchema.create(userInfo);
            console.log("User is registered");
            console.log(accountDoc);
            res.status(201).json({success: true, doc: accountDoc});
        } else {
            console.log("User is alread exist");
            res.status(401).json({success: false, message: "User is already exist"});
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}