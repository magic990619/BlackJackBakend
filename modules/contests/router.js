var express = require('express');
var router = express.Router();
var _contests = require('./ctl_contests.js')

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Contests Time: ', Date.now());
  next();
});

// getAllGameNames
router.get('/getAllContests', _contests.getAllContests);

router.post('/getAllContestsByAccountId', _contests.getAllContestsByAccountId);

router.post('/getContestsDataByID', _contests.getContestsDataByID);

router.post('/addContest', _contests.addContest);

router.post('/updateContest', _contests.updateContest);

router.post('/removeContest', _contests.removeContest);

module.exports = router;