var express = require('express');
var router = express.Router();

//Functions

function getHome(req, res){
    var user = new User(req.user);
    res.render('home.ejs', { title: 'Home', bread: [], user: user, message: req.flash('loginMessage') });
}

function getAutocomp(req, res){
    var user = new User(req.user);
    res.render('autocomp.ejs', { title: 'Home', bread: [], user: user, message: req.flash('loginMessage') });
}


//Routes
router.route('/').get(getHome);
router.route('/autocomp').get(getAutocomp);
module.exports = router;