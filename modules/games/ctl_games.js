var GamesSchema = require('../schemas/game_schema.js');

module.exports.getAllGameNames = async function (req, res) {
    try {
        GamesSchema.find( {} , function (err, doc) {
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

module.exports.addGameName = async function (req, res) {
    console.log(req.body);
    try {
        var doc = await GamesSchema.findOne({name: req.body.game.name});
        if (doc != null) {
            res.status(401).json({success: false, message: 'This GameName is already exist.'});
        }
        else {
            doc = await GamesSchema.create(req.body.game);
            res.status(201).json({success: true, doc: doc });    
        }
    } catch(error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.updateGameName = async function (req, res) {
    console.log(req.body.game.name);
    try {
        var doc = await GamesSchema.update({_id: req.body.game._id}, req.body.game);
        res.status(201).json({success: true, doc: doc });
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.removeGameName = async function (req, res) {
    console.log(req.body.game._id);
    try {
        var doc = await GamesSchema.findOne({_id: req.body.game._id});
        if (doc == null) {
            res.status(401).json({success: false, message: 'This game does not exist.'});
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