var express = require('express');
var app = express();

// Routes
var home = require('./routes/home.js');
var races = require('./routes/races.js');
var users = require('./routes/users.js');

app.use('/', home);
app.use('/races', races);
app.use('/users', users);

app.listen(process.env.PORT || 3000);