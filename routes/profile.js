var express = require('express');
var router = express.Router();
var _ = require('underscore');
var mongoose = require('mongoose');

//Models
Race = mongoose.model('Race');

//Functions

//API
function getProfile(req, res){
    var user = new User(req.user);
    res.render('profile.ejs', { title: 'Profile', bread: ['Profile'],  user : user });
}

function logout(req, res) {
    req.logout();
    res.redirect('/');
}

//Routes
router.route('/')
    .get(getProfile);
router.route('/logout')
    .get(logout);

module.exports = router;