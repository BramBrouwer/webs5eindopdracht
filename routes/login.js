var express = require('express');
var router = express.Router();
var passport = require('passport');

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
    //werkt flash message nog?
    // kan je deze in de json meegeven?
function getloginFailure(req,res){
    res.status(500);
    if(isJsonRequest(req)){
        res.json({response: req.flash('loginMessage')})
    }else{
        res.redirect('/');
    }
}


function isJsonRequest(req){
      if(req.accepts('html') == 'html'){
          return false;
      }
      return true;
}





//Routes
router.route('/')
    .get(getHome)
    .post(passport.authenticate('local', {
        successRedirect : 'login/success', // redirect to the secure profile section
        failureRedirect : '/login/failure', // redirect back to the signup page if there is an error
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
                successRedirect : '/',
                failureRedirect : '/'
        }));
        
router.route('/success')
      .get(getLoginSuccess);

router.route('/failure')
    .get(getloginFailure);


        

module.exports = router;