var express = require('express');
var router = express.Router();

//Routes
router.get('/', function(req, res){
         res.render('login.ejs', { title: 'Login', message: req.flash('loginMessage') });
});

module.exports = router;