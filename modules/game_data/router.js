var express = require('express');
var router = express.Router();
var _data = require('./ctl_data.js')

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('GameData Time: ', Date.now());
  next();
});

// getAllGameNames
router.post('/saveGameData', _data.saveGameData);

router.post('/saveCreditData', _data.saveCreditData);

router.get('/getAllGameData', _data.getAllGameData);

router.post('/getGameDataByGameId', _data.getGameDataByGameId);

router.post('/getGameDataByGameIdAdmin', _data.getGameDataByGameIdAdmin);

// router.post('/updateGameName', _games.updateGameName);

// router.post('/removeGameName', _games.removeGameName);

module.exports = router;