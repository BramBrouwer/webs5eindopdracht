var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var session      = require('express-session');
var argv = require('minimist')(process.argv.slice(2));
var swagger = require("swagger-node-express");

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
    if (req.path.startsWith('/login') || req.path.startsWith('/v1') ||req.path.startsWith('/swagger') || req.path.startsWith('/api-docs'))
        return next();
    // if they aren't redirect them to the login page
    if(isJsonRequest(req)){
        res.json({err: "Please login first"});
    }else{
        res.redirect('/login');
    }
});

app.post('/races', requireRole('admin'));
app.post('/races/*', requireRole('admin'));
app.delete('/races/*', requireRole('admin'));
app.put('/races/*', requireRole('admin'));
app.get('/races/:id/waypoints/:waypointid/users', requireRole('admin'));

app.all('/users', requireRole('admin'));
app.post('/users', requireRole('admin'));

app.all('/places', requireRole('admin'));

//Routes
app.use('/', require('./routes/home.js')());
app.use('/login', require('./routes/login.js')(isJsonRequest));
app.use('/races', require('./routes/races.js')(handleError,isJsonRequest));
app.use('/users', require('./routes/users.js')(app,handleError,isJsonRequest));
app.use('/profile', require('./routes/profile.js')(isJsonRequest));
app.use('/places',require('./routes/places.js')(handleError,isJsonRequest));

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

function requireRole(role) {
    return function(req, res, next) {
        if(req.user && req.user.role === role){
            next();
        }else if(isJsonRequest(req)){
            res.json({err: 'You are not authorized to perform this action.'});
        }else{
            res.send(403);
        }
    }
}

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


//swagger
var subpath = express();
app.use(express.static('dist'));
app.use("/v1", subpath);
swagger.setAppHandler(subpath);
swagger.setApiInfo({
    title: "example API",
    description: "API to do something, manage something...",
    termsOfServiceUrl: "",
    contact: "yourname@something.com",
    license: "",
    licenseUrl: ""
});
subpath.get('/', function (req, res) {
    res.sendfile(__dirname + '/dist/index.html');
});
swagger.configureSwaggerPaths('', 'api-docs', '');

// Configure the API domain
var domain = 'localhost';
if(argv.domain !== undefined)
    domain = argv.domain;
else
    console.log('No --domain=xxx specified, taking default hostname "localhost".')

// Configure the API port
var port = 3000;
if(argv.port !== undefined)
    port = argv.port;
else
    console.log('No --port=xxx specified, taking default port ' + port + '.')

var applicationUrl = 'https://' + domain + ':' + port;
swagger.configure(applicationUrl, '1.0.0');

