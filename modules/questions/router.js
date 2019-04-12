var express = require('express');
var router = express.Router();
var _questions = require('./ctl_questions.js')

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Questions Time: ', Date.now());
  next();
});

// getAllGameNames
router.get('/getAllQuestions', _questions.getAllQuestions);

router.post('/addQuestion', _questions.addQuestion);

router.post('/updateQuestion', _questions.updateQuestion);

router.post('/removeQuestion', _questions.removeQuestion);

module.exports = router;