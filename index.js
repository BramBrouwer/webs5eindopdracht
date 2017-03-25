var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Data Access Layer
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/restrace');

//Models
require('./models/race');
require('./models/user');
require('./models/waypoint');

// Routes
var home = require('./routes/home.js');
var races = require('./routes/races.js');
var users = require('./routes/users.js');

app.use('/', home);
app.use('/races', races);
app.use('/users', users);

app.listen(process.env.PORT || 3000);