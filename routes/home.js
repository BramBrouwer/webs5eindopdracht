var express = require('express');
var router = express.Router();

//Routes
router.get('/', function(req, res){
         res.render('index.ejs', { title: 'Home', message: req.flash('loginMessage') });
});

module.exports = router;