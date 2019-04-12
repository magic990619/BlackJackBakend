var QuestionSchema = require('../schemas/question_schema.js');

module.exports.getAllQuestions = async function (req, res) {
    try {
        QuestionSchema.find( {} , function (err, doc) {
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

module.exports.addQuestion = async function (req, res) {
    try {
        var doc = await QuestionSchema.findOne({question: req.body.question});
        if (doc != null) {
            res.status(401).json({success: false, message: 'This Question is already exist.'});
        }
        else {
            var question = {
                question: req.body.question
            };
            doc = await QuestionSchema.create(question);
            res.status(201).json({success: true, doc: doc });    
        }
    } catch(error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.updateQuestion = async function (req, res) {
    console.log(req.body.question.question);
    try {
        var doc = await QuestionSchema.update({_id: req.body.question._id}, req.body.question);
        res.status(201).json({success: true, doc: doc });
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.removeQuestion = async function (req, res) {
    console.log(req.body.question._id);
    try {
        var doc = await QuestionSchema.findOne({_id: req.body.question._id});
        if (doc == null) {
            res.status(401).json({success: false, message: 'This question does not exist.'});
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