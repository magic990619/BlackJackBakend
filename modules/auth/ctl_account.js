var AccountSchema = require('../schemas/account_schema.js');

var jwt = require('jsonwebtoken');

var bcrypt = require('bcryptjs');

module.exports.getAllAccountData = async function (req, res) {
    try {
        AccountSchema.find( {} , function (err, doc) {
            if (err) {
                console.log(err);
              res.status(201).json({success: false, message: err});
            }else{
                res.status(201).json({success: true, doc: doc});
            }
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
    
}

module.exports.getInactiveAccountData = async function (req, res) {
    try {
        AccountSchema.find( {"account_status": "Inactive"} , function (err, doc) {
            if (err) {
                console.log(err);
              res.status(201).json({success: false, message: err});
            }else{
                res.status(201).json({success: true, doc: doc});
            }
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
    
}

module.exports.getActiveAccountData = async function (req, res) {
    try {
        AccountSchema.find( {"account_status": "Active"} , function (err, doc) {
            if (err) {
                console.log(err);
              res.status(201).json({success: false, message: err});
            }else{
                res.status(201).json({success: true, doc: doc});
            }
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
    
}

module.exports.getClosedAccountData = async function (req, res) {
    try {
        AccountSchema.find( {"account_status": "Closed"} , function (err, doc) {
            if (err) {
                console.log(err);
              res.status(201).json({success: false, message: err});
            }else{
                res.status(201).json({success: true, doc: doc});
            }
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.getRestrictedAccountData = async function (req, res) {
    try {
        AccountSchema.find( {"account_status": "Restricted"} , function (err, doc) {
            if (err) {
                console.log(err);
              res.status(201).json({success: false, message: err});
            }else{
                res.status(201).json({success: true, doc: doc});
            }
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
    
}

module.exports.updateAccountData = function (req, res) {
    // console.log(req.body);
    var userInfo = {
        user_name: req.body.user.user_name,
        email: req.body.user.email,
        role: req.body.user.role,
        credit: req.body.user.credit,
        account_status: req.body.user.account_status,
    }

    var query = { '_id': req.body.user._id }

    AccountSchema.update(query, userInfo, function (err, doc) {
        if (err) {
            res.status(401).json({success: false, error: err});
        } else {
            res.status(201).json({success: true, doc: doc});
        }
    })
}

module.exports.removeAccountData = function (req, res) {

    console.log(req.body);
    AccountSchema.findOne({'_id': req.body.accountId}, function (err, doc) {
        if (err) {
            res.status(401).json({ message: 'Error user find' });
        }else{
            if (doc == null) {
                console.log(req.body.accountId + " => doc doesn't exist");
                res.status(401).json({ message: 'null error' , doc: doc});
            }else{
                doc.remove(function (err, doc) {
                    if (err)
                        res.status(401).json({ message: 'Error deleted' });
                    else
                        res.status(201).json({ message: 'Successfully deleted' });
                });
            }
        }
    })
}

module.exports.removeAccountsData = function (req, res) {

    console.log(req.body);
    var cursor  = req.body.accountIds;
    cursor.forEach(cur => {
        AccountSchema.findOne({'_id': cur}, function (err, doc) {
            if (err) {
                res.status(401).json({ message: 'Error user find' });
            }else{
                if (doc == null) {
                    console.log(req.body.accountId + " => doc doesn't exist");
                    res.status(401).json({ message: 'null error' , doc: doc});
                }else{
                    doc.remove(function (err, doc) {
                        if (err)
                            res.status(401).json({ message: 'Error deleted' });
                    });
                }
            }
        });    
    });
    res.status(201).json({ message: 'Successfully deleted' });
}

module.exports.getAccountDataById = async function (req, res) {
    console.log(req.body._id);
    try {
        AccountSchema.findOne( { '_id' : req.body._id } , function (err, doc) {
            if (err) {
                console.log(err);
              res.status(201).json({success: false, message: err});
            }else{
                res.status(201).json({success: true, doc: doc});
            }
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
    
}

module.exports.getAccountDataByEmail = async function (req, res) {
    console.log(req.body.email);
    try {
        var user = await AccountSchema.findOne( {'email' : req.body.email } );
        if (user == null) {
            res.status(401).json({success: true, message: "Can't find player"});
        } else {
            res.status(201).json({success: true, doc: user});
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
    
}

module.exports.addAccountData = async function (req, res) {
    console.log(req.body.newAccount);
    try {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync("1234567890", salt);

        var userInfo = {
            user_name: req.body.newAccount.user_name,
            email :     req.body.newAccount.email || null,
            password:   hash,
            role: req.body.newAccount.role == '' ? 'user' : req.body.newAccount.role,
            credit: 1000,
            account_status:   req.body.newAccount.account_status == '' ? "Active" : req.body.newAccount.account_status,
        }
        var accountDoc = await AccountSchema.findOne({'email': userInfo.email});
        if (accountDoc == null) {
            accountDoc = await AccountSchema.create(userInfo);
            console.log("Account is registered");
            res.status(201).json({success: true, doc: accountDoc});
        } else {
            console.log("Account is alread exist");
            res.status(201).json({success: false, message: "Account is already exist"});
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.resetPassword = async function (req, res) {
    console.log(req.body.accountId);
    try {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync("1234567890", salt);

        var userInfo = {
            password: hash
        }
    
        var query = { '_id': req.body.accountId }
    
        AccountSchema.update(query, userInfo, function (err, doc) {
            if (err) {
                res.status(401).json({success: false, error: err});
            } else {
                res.status(201).json({success: true, doc: doc});
            }
        })    
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.resetPasswordByEmail = async function (req, res) {
    console.log(req.body.email);
    try {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);

        var account = await AccountSchema.findOne({"email": req.body.email});
        account.password = hash;

        var doc = await AccountSchema.update({"email": req.body.email}, account);

        res.status(201).json({success: true, message:"Successfully changed!"});
         
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.setAccountAvatar = async function (req, res) {
    var userInfo = {
        avatar: req.body.path
    }

    var query = { '_id': req.body.user_id }

    AccountSchema.update(query, userInfo, function (err, doc) {
        if (err) {
            res.status(401).json({success: false, error: err});
        } else {
            res.status(201).json({success: true, doc: doc});
        }
    })
}

module.exports.transferCredit = async function (req, res) {
    try {
        var fromUser = await AccountSchema.findOne({email: req.body.from});
        var toUser = await AccountSchema.findOne({email: req.body.to});
        if(toUser == null)
        {
            res.status(401).json({success: false, message: "Can't find player"});
        }
        else
        {
            fromUser.credit -= req.body.amount;
            toUser.credit = parseInt(toUser.credit) + parseInt(req.body.amount);
            fromUser.save();
            toUser.save();
            res.status(201).json({success: true, message: fromUser.credit});
        }

    } catch(error) {
        res.status(401).json({success: false, error: err});
    }
}

module.exports.updatePlayerName = async function (req, res) {
    try {
        console.log(req.body.account_id);
        console.log(req.body.user_name);
        var account = await AccountSchema.findOne({_id: req.body.account_id});
        account.user_name = req.body.user_name;

        var account = await AccountSchema.update({_id: req.body.account_id}, account);

        res.status(201).json({success: true, account: account});

    } catch(error) {
        res.status(401).json({success: false, error: err});
    }
}
