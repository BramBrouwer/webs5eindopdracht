var express = require('express');
var router = express.Router();
var passport = require('passport');
var isJsonRequest;
//Get login page (no json response possible)
function getHome(req, res){
         res.render('login.ejs', { title: 'Login', message: req.flash('loginMessage') });
}
//Login success callback
function getLoginSuccess(req,res){
    res.status(200);
    if(isJsonRequest(req)){
        res.json({response: "Succesfully logged in"});
    }else{
          res.redirect('/');
    }  
}

//Login failure callback
function getloginFailure(req,res){
    res.status(500);
    if(isJsonRequest(req)){
        res.json({response: req.flash('loginMessage')})
    }else{
        res.redirect('/');
    }
}
//-----------------LOCAL LOGIN
//Local login
router.route('/')
    .get(getHome)
    .post(passport.authenticate('local', {
        successRedirect : 'login/success', // redirect to the secure profile section
        failureRedirect : 'login/failure', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

//Local login success   
router.route('/success')
      .get(getLoginSuccess);

//Local login failure
router.route('/failure')
    .get(getloginFailure);

//---------------GOOGLE LOGIN
//Google login 
router.route('/google')
    .get(passport.authenticate('google', {
        scope : ['profile', 'email'] 
    }));

// Google login callback
router.route('/google/callback')
    .get(passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/'
        }));
//----------TWITTER ICON
router.route('/twitter')
    .get(passport.authenticate('twitter'));

router.route('/twitter/callback')
    .get(passport.authenticate('twitter', {
            successRedirect : '/',
            failureRedirect : '/'
        }));

module.exports = function (jsonChecker){
    isJsonRequest = jsonChecker;
	console.log('Initializing login routing module');
	return router;
};