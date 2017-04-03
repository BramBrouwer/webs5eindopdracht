var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var session      = require('express-session');

var http = require('http');
var express = require('express'),
    app = module.exports.app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance
app.io = io;
server.listen(process.env.PORT || 3000); 


//LOCAL DATABSAE
mongoose.connect('mongodb://localhost:27017/restrace');

//MLAB DATABASE
//mongoose.connect('mongodb://admin:admin@ds041506.mlab.com:41506/webs5eindropdracht');

require('./config/passport')(passport); // pass passport for configuration

mongoose.Promise = require('q').Promise;
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

//Models
require('./models/race');
require('./models/generateTestData')();

//Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
//require('./routes/login.js')(passport); // Try to pass passport and app AFTER serting up passport/flash
app.use(function (req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    if (req.path.startsWith('/login'))
        return next();
    // if they aren't redirect them to the home page
    if(isJsonRequest(req)){
        res.json({err: "Please login first"});
    }else{
        res.redirect('/login');
    }
});

//Routes
app.use('/', require('./routes/home.js')());
app.use('/login', require('./routes/login.js')());
app.use('/races', require('./routes/races.js')(handleError));
app.use('/users', require('./routes/users.js')(app,handleError));
app.use('/profile', require('./routes/profile.js')());
app.use('/places',require('./routes/places.js')(handleError));

//Error handler
function handleError(req, res, statusCode, message){
    console.log();
    console.log('-------- Error handled --------');
    console.log('Request Params: ' + JSON.stringify(req.params));
    console.log('Request Body: ' + JSON.stringify(req.body));
    console.log('Response sent: Statuscode ' + statusCode + ', Message "' + message + '"');
    console.log('-------- /Error handled --------');
    res.status(statusCode);    
  
    if(isJsonRequest(req)){
          console.log("isjson");
          res.json({err: message});
    }else{
        console.log("ishtml");
        res.render('error', {error: message});
    }
};

//Check if we need to return json or html
function isJsonRequest(req){
      if(req.accepts('html') == 'html'){
          return false;
      }
      return true;
}


io.on('connection', function (socket) {
  console.log('log connected');
});