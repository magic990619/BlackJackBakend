var express = require('express');
var router = express.Router();
var _games = require('./ctl_games.js')

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Game Time: ', Date.now());
  next();
});

// getAllGameNames
router.get('/getAllGameNames', _games.getAllGameNames);

router.post('/addGameName', _games.addGameName);

router.post('/updateGameName', _games.updateGameName);

router.post('/removeGameName', _games.removeGameName);

module.exports = router;