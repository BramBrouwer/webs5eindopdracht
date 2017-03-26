var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var session      = require('express-session');

mongoose.connect('mongodb://localhost:27017/restrace');
require('./config/passport')(passport); // pass passport for configuration

mongoose.Promise = require('q').Promise;
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

//Models
require('./models/race');
require('./models/generateTestData')();

//Routes
app.use('/', require('./routes/home.js'));
app.use('/races', require('./routes/races.js'));
app.use('/users', require('./routes/users.js'));
app.use('/login', require('./routes/login.js'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
//- User wordt geexport zodat deze ook bereikbaar is in passport configuration (om een of andere reden lukt dit niet als ie gewoon hie gerequired wordt)

//Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
require('./routes/login.js')(app, passport); // Try to pass passport and app AFTER serting up passport/flash

app.listen(process.env.PORT || 3000);