var express = require('express');
var router = express.Router();
var passport = require('passport');

//Functions
function getHome(req, res){
         res.render('login.ejs', { title: 'Login', message: req.flash('loginMessage') });
}

//Routes
router.route('/')
    .get(getHome);

//Local login
router.route('/')
    .post(passport.authenticate('local', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

//Google login 
router.route('/google')
    .get(passport.authenticate('google', {
        scope : ['profile', 'email'] 
    }));

    // Google login callback
router.route('/google/callback')
    .get(passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
        }));

module.exports = router;