var express = require('express');
var router = express.Router();
var passport = require('passport');

//Functions
function getHome(req, res){
         res.render('login.ejs', { title: 'Login', message: req.flash('loginMessage') });
}

function postLogin(req, res){
    passport.authenticate('local', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    });
}

function getGoogleLogin(req, res){
    passport.authenticate('google', {
        scope : ['profile', 'email'] 
    });
}

function getGoogleCallback(req, res){
        passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
        });
}

//Routes
router.route('/')
    .get(getHome);

//Local login
router.route('/')
    .post(postLogin);

//Google login 
router.route('/google')
    .get(getGoogleLogin);

    // Google login callback
router.route('/google/callback')
    .get(getGoogleCallback);

module.exports = router;