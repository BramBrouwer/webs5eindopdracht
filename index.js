var express  = require('express');
var app      = express();
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

mongoose.connect('mongodb://localhost:27017/restrace');
require('./config/passport')(passport); // pass passport for configuration


app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

//TODO zorg ervoor dan login in een aparte route staat en voeg authenticatie en shit toe 
//Models
require('./models/race');
//require('./models/user');
require('./models/generateTestData')();

//Routes
var home = require('./routes/home.js');
var races = require('./routes/races.js');
var users = require('./routes/users.js');


//Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // set up ejs for templating


// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
require('./routes/login.js')(app, passport); // Try to pass passport and app AFTER serting up passport/flash



app.use('/', home);
app.use('/races', races);
app.use('/users', users);

app.listen(process.env.PORT || 3000);