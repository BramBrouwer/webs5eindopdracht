var express = require('express');
var router = express.Router();

//Functions
function getHome(req, res){
    var user = new User(req.user);
    console.log(req.headers);
    res.render('home.ejs', { title: 'Home', bread: [], user: user, message: req.flash('loginMessage') });
}

//Routes
router.route('/').get(getHome);
module.exports = router;