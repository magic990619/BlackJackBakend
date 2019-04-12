const express = require('express');
const path = require('path');
var cors = require('cors')

const Auth = require('./modules/auth/router.js');
const Games = require('./modules/games/router.js');
const GameData = require('./modules/game_data/router.js');
const Base = require('./modules/base/router.js');
const Questions = require('./modules/questions/router.js');

require('./config/db_connection.js');
require('./config/passport.js');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var multer = require('multer');
const app = express();

app.use(cors())

var cookieParser = require('cookie-parser');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
            var err = new Error();
            err.code = 'filetype';
            return cb(err);
        } else {
            cb(null, Date.now() + '-' +  file.originalname);
        }
    }
})

var upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }
}).single('file');

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.use(cookieParser());

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json 
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

  
app.use('/api/auth', Auth);
app.use('/api/games', Games);
app.use('/api/game_data', GameData);
app.use('/api/base', Base);
app.use('/api/questions', Questions);
// app.use('/api/profile', Profile);
// app.use('/category', Category);
// app.use('/faq', Faq);
// app.use('/support', Support);
// app.use('/events', Events);
// app.use('/base', Base);
// app.use('/photo', Photo);


app.get('*', (req,res) =>{
    console.log("Loading Page => " + req.url);
    res.sendFile(path.join(__dirname+'/public/index.html'));
});


// FileUpload

app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.json({ success: false, message: 'The file size is too big! Max. 10MB' });
            } else if (err.code === 'filetype') {
                res.json({ success: false, message: 'The file does not match the desired file format! (JPG, JPEG, PNG)'});
            }else {
                console.log(err);
                res.json({success: false, message: 'The upload of the file could not be completed.'});
            }
        }else{
            if(!req.file){
                res.json({success: false, message: 'No file was selected for upload!'});
            }else{
                res.json({success: true, message: 'The file has been uploaded successfully.', file: req.file});
            }
        }
    })
})


// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401);
      res.json({"message" : err.name + ": " + err.message});
    }
  });


// web server 8080

app.listen(80, () => console.log('-- [ FRIENDEALER NODE ] SERVER STARTED LISTENING ON PORT 80 --'));

// Socket Server Engine

var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = 8889;

server.listen( port ,function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("-- [ FRIENDEALER SOCKET ] "+" SERVER STARTED ON PORT " + port + " --");
    // console.log(server);
});
