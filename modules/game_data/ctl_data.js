// var socket = require('socket.io-client')('http://192.168.100.124:8889');
var socket = require('socket.io-client')('http://104.237.5.22:8889');
var DataSchema = require('../schemas/game_data_schema.js');
var accountSchema = require('../schemas/account_schema');
var ContestsDataSchema = require('../schemas/contests_data_schema');
var ContestsSchema = require('../schemas/contests_schema');
var NotificationSchema = require('../schemas/notifications_schema');

module.exports.getAllGameData = async function (req, res) {
    try {
        DataSchema.find( {} , function (err, doc) {
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

module.exports.getGameDataByGameIdAdmin = async function (req, res) {
    try {
        console.log(req.body.game_id);
        DataSchema.find( {"game_id": req.body.game_id} , async function (err, doc) {
            if (err) {
                console.log(err);
              res.status(201).json({success: false, message: err});
            } else {
                console.log(doc);
                var options = {
                    "sort": "credit"
                };
                var accounts = await accountSchema.find({"role": {$ne: "admin"}}, {}, {sort: {credit: -1}});
                console.log(accounts);
                res.status(201).json({success: true, doc: doc, accounts: accounts});
            }
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.getGameDataByGameId = async function (req, res) {
    try {
        console.log(req.body.game_id);
        var rank_category = req.body.rank_category;
        var rank_period = req.body.rank_period;
        DataSchema.find( {"game_id": req.body.game_id} , async function (err, doc) {
            if (err) {
                console.log(err);
              res.status(201).json({success: false, message: err});
            } else {
                var result = Array();
                var accounts = await accountSchema.find({"role": {$ne: "admin"}}, {}, {sort: {credit: -1}});
                var datetime = new Date();
                var year = datetime.getFullYear();
                var month = datetime.getMonth() + 1;
                var date = datetime.getDate();
                var day = datetime.getDay();
                var week_start_date = date - day;
                accounts.forEach(account => {
                    var result_record = {
                        "account_id": account._id,
                        "username": account.user_name,
                        "credit": account.credit,
                        "level": account.level,
                        "won_credit": 0,
                        "wins": 0,
                        "total_played": 0,
                        "location": account.location,
                    };
                    doc.forEach(leader_record => {
                        if (account._id == leader_record.account_id) {
                            if (rank_period == 1)
                            {
                                result_record.wins += leader_record.total_winning;
                                result_record.total_played += leader_record.total_wagered;
                                result_record.won_credit += leader_record.won_credit;
                            } else if (rank_period == 2) {
                                var sel_year = leader_record.played_date.slice(0, 4);
                                if (year == parseInt(sel_year)) {
                                    result_record.wins += leader_record.total_winning;
                                    result_record.total_played += leader_record.total_wagered;    
                                    result_record.won_credit += leader_record.won_credit;
                                }
                            } else if (rank_period == 3) {
                                var sel_year = leader_record.played_date.slice(0, 4);
                                var sel_month = leader_record.played_date.slice(5,7);
                                if (year == parseInt(sel_year) && month == parseInt(sel_month)) {
                                    result_record.wins += leader_record.total_winning;
                                    result_record.total_played += leader_record.total_wagered;    
                                    result_record.won_credit += leader_record.won_credit;
                                }
                            } else if (rank_period == 4) {
                                var sel_year = leader_record.played_date.slice(0, 4);
                                var sel_month = leader_record.played_date.slice(6,7);
                                var sel_date = leader_record.played_date.slice(8,10);
                                if (year == parseInt(sel_year) && month == parseInt(sel_month) && parseInt(sel_date) >= week_start_date) {
                                    result_record.wins += leader_record.total_winning;
                                    result_record.total_played += leader_record.total_wagered;    
                                    result_record.won_credit += leader_record.won_credit;
                                }
                            }
                        }
                    });
                    result.push(result_record);
                });
                if (rank_category == 3 ) {
                    result.sort(function(a,b) {
                        if (a.wins < b.wins) {
                            return 1;
                        } 
                        if (a.wins > b.wins) {
                            return -1;
                        } 
                        return 0;
                    });    
                } else if (rank_category == 2) {
                    result.sort(function(a,b) {
                        if (a.won_credit < b.won_credit) {
                            return 1;
                        } 
                        if (a.won_credit > b.won_credit) {
                            return -1;
                        } 
                        return 0;
                    });    
                } else if (rank_category == 4) {
                    result.sort(function(a,b) {
                        var win_rate_a, win_rate_b;
                        if (a.total_played == 0)
                            win_rate_a = 0;
                        else
                            win_rate_a = a.wins * 100.0 / a.total_played;
                        if (b.total_played == 0)
                            win_rate_b = 0;
                        else
                            win_rate_b = b.wins * 100.0 / b.total_played;
                        console.log(win_rate_a);
                        console.log(win_rate_b);
                        if (win_rate_a < win_rate_b) {
                            return 1;
                        } 
                        if (win_rate_a > win_rate_b) {
                            return -1;
                        } 
                        return 0;
                    });    
                }
                // console.log(result);
                res.status(201).json({success: true, result: result});
            }
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.saveGameData = async function (req, res) {
    try {
        
        var account = await accountSchema.findOne({_id: req.body.account_id});
        account.credit = req.body.credit;
        if (req.body.won_credit > 0)
        {
            account.won_credit += parseInt(req.body.won_credit);
            while (1) {
                if (account.won_credit < 1000 * (account.level + 1))
                    break;
                account.won_credit -= 1000 * (account.level + 1);
                account.level ++;
            }
        }
        var account = await accountSchema.update({_id: req.body.account_id}, account);

        var gameData = await DataSchema.findOne({"account_id"   : req.body.account_id,
                                                 "game_id"      : req.body.game_id,
                                                 "played_date"  : req.body.played_date});
        if (gameData == null) {
            var doc = {
                account_id: req.body.account_id,
                game_id: req.body.game_id,
                total_winning: (req.body.total_winning == "True") ? 1 : 0,
                total_wagered: req.body.total_wagered,
                won_credit: (req.body.won_credit > 0 ? req.body.won_credit : 0),
                wining_percenet: 0,
                played_hand: req.body.played_hand,
                played_date: req.body.played_date
            }
            doc = await DataSchema.create(doc);
        } else {
            gameData.total_winning += (req.body.total_winning == "True") ? 1 : 0;
            gameData.total_wagered += parseInt(req.body.total_wagered);
            gameData.played_hand += parseInt(req.body.played_hand);
            if (req.body.won_credit > 0)
                gameData.won_credit += parseInt(req.body.won_credit);
            var doc = await DataSchema.update({ "account_id"   : req.body.account_id,
                                                "game_id"      : req.body.game_id,
                                                "played_date"  : req.body.played_date}, gameData);
        }
        if (req.body.contest_mode == 1) {
            var contest_data = await ContestsDataSchema.findOne({"account_id": req.body.account_id,
                                                           "contest_id": req.body.contest_id});
            if (req.body.contest_type == "Consective Wins") {
                if (contest_data.user_score < parseInt(req.body.consec_wins)) {
                    contest_data.user_score = parseInt(req.body.consec_wins);
                }
            } else {
                contest_data.user_score += parseInt(req.body.score_get);
            }
            if (contest_data.user_score >= parseInt(req.body.contest_goal)) {
                contest_data.winner_status = true;
                contest_data.winner_date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16);
                var current_contest = await ContestsSchema.findOne({"_id": req.body.contest_id});
                var account = await accountSchema.findOne({_id: req.body.account_id});
                var new_notification = {
                    user_id: account._id,
                    title: "New Winner!",
                    notification: account.user_name + " won the contest: " + current_contest.contest_name,
                };
                new_notification = await NotificationSchema.create(new_notification);
                socket.emit('send:winner_notification', {
                    winner_name: account.user_name,
                    contest_name: current_contest.contest_name
                });
            }
            contest_data = await ContestsDataSchema.update({"_id": contest_data._id}, contest_data);
        }
        res.status(201).json({success: true, doc: doc});
        
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.saveCreditData = async function (req, res) {
    try {
        var account = await accountSchema.findOne({_id: req.body.account_id});
        account.credit += parseInt(req.body.credit);
        
        var account = await accountSchema.update({_id: req.body.account_id}, account);

        res.status(201).json({success: true, account: account});
        
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.saveCreditDataAfterContest = async function (req, res) {
    try {
        var account = await accountSchema.findOne({_id: req.body.account_id});
        account.credit -= parseInt(req.body.credit);
        
        var account = await accountSchema.update({_id: req.body.account_id}, account);

        var doc = {
            account_id: req.body.account_id,
            contest_id: req.body.contest_id,
            user_score: 0,
            winner_status: false,
            winner_date: ""
        };

        doc = await ContestsDataSchema.create(doc);

        res.status(201).json({success: true, account: account});
        
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.getUserContestData = async function (req, res) {
    try {
        var contest_data = await ContestsDataSchema.findOne({"account_id": req.body.account_id,
                                                           "contest_id": req.body.contest_id});
        if (contest_data == null) {
            res.status(201).json({success: false, score: 0});
        } else {
            res.status(201).json({success: true, score: contest_data.user_score});
        }
        
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.getNotifications = async function (req, res) {
    try {
        var doc = await NotificationSchema.find({}, {}, {sort: {created_at: -1}});
        res.status(201).json({success: true, doc: doc});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.readNotifications = async function (req, res) {
    try {
        const modify = req.body.notifications;
        modify.map(async (cursor)=>{
            await NotificationSchema.update({user_id: cursor.user_id, title: cursor.title, created_at: cursor.created_at}, cursor)
        })
        res.status(201).json({success: true });
    } catch(error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}