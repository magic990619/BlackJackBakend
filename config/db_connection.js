const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/MyGames', {
    useMongoClient: true,
    autoIndex: false
    // other options 
});

mongoose.connection.once('open', function(){
    console.log('-- [ MongoDB ] CONNECTION SUCCESSFUL --');
}).on('error', function(error){
    console.log('-- [ MongoDB ] CONNECTION ERROR :', error);
});