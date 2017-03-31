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
    
    if(isJsonRequest(req)){
        if(req.user == null){
            res.json({err: "No user given"})
        }else{
            res.json({user: req.user});
        }
        console.log(req.user);
    }else{   
        res.render('profile.ejs', { title: 'Profile', bread: ['Profile'],  user : user });
    }
}

function logout(req, res) {
    if(isJsonRequest(req)){
        req.logout();
        res.json({msg: "Logged out"});
    }else{
         req.logout();
         res.redirect('/login');
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
    .get(getProfile);
router.route('/logout')
    .get(logout);

module.exports = router;