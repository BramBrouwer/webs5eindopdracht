var express = require('express');
var router = express.Router();

//Functions

function getHome(req, res){
    res.render('home.ejs', { title: 'Home', bread: [], message: req.flash('loginMessage') });
}

//Routes
router.route('/').get(getHome);

module.exports = router;