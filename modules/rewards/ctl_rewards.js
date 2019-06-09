var RewardsSchema = require('../schemas/rewards_schema.js');
var AccountSchema = require('../schemas/account_schema.js');

module.exports.getAllRewards = async function (req, res) {
    try {
        RewardsSchema.find( {} , function (err, doc) {
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

module.exports.addReward = async function (req, res) {
    // console.log(req.body);
    try {
        var doc = {
            day: req.body.day,
            amount: req.body.amount
        };
        doc = await RewardsSchema.create(doc);
        res.status(201).json({success: true, doc: doc });    
    } catch(error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.updateReward = async function (req, res) {
    try {
        var doc = await RewardsSchema.update({_id: req.body.reward._id}, req.body.reward);
        res.status(201).json({success: true, doc: doc });
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.removeReward = async function (req, res) {
    // console.log(req.body.game._id);
    // try {
    //     var doc = await GamesSchema.findOne({_id: req.body.game._id});
    //     if (doc == null) {
    //         res.status(401).json({success: false, message: 'This game does not exist.'});
    //     }
    //     else {
    //         doc.remove(function(err, doc) {
    //             if (err)
    //                 res.status(401).json({ message: 'Error deleted' });
    //             else
    //                 res.status(201).json({ message: 'Successfully deleted' });
    //         });
    //     }
    // } catch(error) {
    //     console.log(error);
    //     res.status(401).json({success: false, error: error});
    // }
}

module.exports.getClientReward = async function (req, res) {
    console.log(req.body.account_id);
    try {
        var doc = await AccountSchema.findOne({_id: req.body.account_id});
        if (doc == null) {
            res.status(401).json({success: false, message: 'This user does not exist.'});
        } else {
            res.status(201).json({  success: true, 
                                    last_rewarded_time: doc.last_rewarded_time, 
                                    reward_day: doc.reward_day, 
                                    today_rewarded: doc.today_rewarded });
        }
    } catch(error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.SaveAfterDailyReward = async function (req, res) {
    // console.log(req.body.account_id);
    // console.log(req.body.credit);
    // console.log(req.body.rewarded_time);
    // console.log(req.body.reward_day);
    // console.log(req.bod.today_rewarded);
    try {
        var doc = await AccountSchema.findOne({_id: req.body.account_id});
        if (doc == null) {
            res.status(401).json({success: false, message: 'This user does not exist.'});
        } else {
            doc.credit = req.body.credit;
            doc.last_rewarded_time = req.body.rewarded_time;
            doc.today_rewarded = (req.body.today_rewarded == "true" ? true : false);
            doc.reward_day = req.body.reward_day;
            doc = await AccountSchema.update({_id: req.body.account_id}, doc);
            res.status(201).json({  success: true });
        }
    } catch(error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}