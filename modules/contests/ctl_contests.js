var RewardsSchema = require('../schemas/rewards_schema.js');
var AccountSchema = require('../schemas/account_schema.js');
var ContestsSchema = require('../schemas/contests_schema.js');
var ContestsDataSchema = require("../schemas/contests_data_schema.js");

module.exports.getAllContests = async function (req, res) {
    var  current_time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16);
    try {
        ContestsSchema.find( { game_id: 0 } , function (err, doc) {
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

module.exports.addContest = async function (req, res) {
    try {
        var doc = {
            contest_name: req.body.contest.contest_name,
            contest_type: req.body.contest.contest_type,
            entry_fee: req.body.contest.entry_fee,
            contest_goal: req.body.contest.contest_goal,
            contest_rewards: req.body.contest.contest_rewards,
            start_time: req.body.contest.start_time.replace(/T/, ' '),
            end_time: req.body.contest.end_time.replace(/T/, ' '),
            contest_description: req.body.contest.contest_description,
        };
        console.log(doc);
        doc = await ContestsSchema.create(doc);
        res.status(201).json({success: true, doc: doc });    
    } catch(error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.updateContest = async function (req, res) {
    try {
        var doc = await ContestsSchema.update({_id: req.body.contest._id}, req.body.contest);
        res.status(201).json({success: true, doc: doc });
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.removeContest = async function (req, res) {
    try {
        var doc = await ContestsSchema.findOne({_id: req.body.contest._id});
        if (doc == null) {
            res.status(401).json({success: false, message: 'This contest not exist.'});
        }
        else {
            doc.remove(function(err, doc) {
                if (err)
                    res.status(401).json({ message: 'Error deleted' });
                else
                    res.status(201).json({ message: 'Successfully deleted' });
            });
        }
    } catch(error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.getAllContestsByAccountId = async function (req, res) {
    var  current_time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16);
    try {
        var contests_data = await ContestsSchema.find( { game_id: 0 , "start_time" : { $lt: current_time }, "end_time" : { $gt: current_time }, });
        var user_contests_data = await ContestsDataSchema.find( {"account_id": req.body.account_id});
        res.status(201).json({success: false, doc: contests_data, user_contests_data: user_contests_data});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.getContestsDataByID = async function (req, res) {
    console.log(req.body.contest_id);
    // try {
        ContestsDataSchema.aggregate([
            { $lookup:
                {
                    from: 'data_accounts',
                    localField: 'account_id',
                    foreignField: '_id',
                    as: 'accountdetails'
                },
            },
            {
                $sort : 
                { 
                    "winner_date" : -1
                }
            }
        ]).exec(function(err, contests_data){
            if(err) throw err;
            console.log(contests_data[0].accountdetails);
            res.status(201).json({success: true, doc: contests_data});
        });
        // res.status(201).json({success: false, doc: contests_data});
    // } catch (error) {
    //     console.log(error);
    //     res.status(401).json({success: false, error: error});
    // }
}