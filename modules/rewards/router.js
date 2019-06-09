var express = require('express');
var router = express.Router();
var _rewards = require('./ctl_rewards.js')

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Rewards Time: ', Date.now());
  next();
});

// getAllGameNames
router.get('/getAllRewards', _rewards.getAllRewards);

router.post('/addReward', _rewards.addReward);

router.post('/updateReward', _rewards.updateReward);

router.post('/removeReward', _rewards.removeReward);

router.post('/getClientReward', _rewards.getClientReward);

router.post('/SaveAfterDailyReward', _rewards.SaveAfterDailyReward);

module.exports = router;