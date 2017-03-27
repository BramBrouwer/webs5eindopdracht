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

//- User wordt geexport zodat deze ook bereikbaar is in passport configuration (om een of andere reden lukt dit niet als ie gewoon hie gerequired wordt)

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
    if (req.path =='/login' || req.path == '/login/google' || req.path == '/login/google/callback')
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/login');
});
//Routes
app.use('/', require('./routes/home.js'));
app.use('/login', require('./routes/login.js'));
app.use('/races', require('./routes/races.js'));
app.use('/users', require('./routes/users.js'));
app.use('/profile', require('./routes/profile.js'));


app.listen(process.env.PORT || 3000);
module.exports = app;