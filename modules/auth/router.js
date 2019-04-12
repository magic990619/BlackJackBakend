var express = require('express');
var router = express.Router();
var _read = require('./ctl_login.js');
var _account = require('./ctl_account.js')
var _register = require('./ctl_register.js');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Auth Time: ', Date.now());
  next();
});

// Login
router.post('/login', _read.login);

// Register
router.post('/register', _register.register);

// getAllAccountData
router.get('/getAllAccountData', _account.getAllAccountData)

router.get('/getActiveAccountData', _account.getActiveAccountData);
router.get('/getInactiveAccountData', _account.getInactiveAccountData);
router.get('/getClosedAccountData', _account.getClosedAccountData);
router.get('/getRestrictedAccountData', _account.getRestrictedAccountData);

router.post('/updateAccountData', _account.updateAccountData);
router.post('/removeAccountData', _account.removeAccountData);
router.post('/removeAccountsData', _account.removeAccountsData);

router.post('/getAccountDataById', _account.getAccountDataById)
router.post('/setAccountAvatar', _account.setAccountAvatar);

router.post('/addAccountData', _account.addAccountData);
router.post('/resetPassword', _account.resetPassword);
router.post('/resetPasswordByEmail', _account.resetPasswordByEmail);

router.post('/transferCredit', _account.transferCredit);
router.post('/getAccountDataByEmail', _account.getAccountDataByEmail);

router.get('/access-token/:access_token', _read.access_token);


/*
// Send Sms Verify code
router.post('/verifySms', _register.sendSmsVerifyCode);

// Check Verify Code
router.post('/verifySmsCheck', _register.smsVerifyTokenCheck);

// Check User Email
router.get('/checkUserEmail/:email', _read.checkEmail);

// Check User Phone
router.get('/checkUserPhone/:phone', _read.checkPhone);
*/

module.exports = router;