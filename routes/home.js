var express = require('express');
var router = express.Router();
var handleError;

//Functions
function getHome(req, res){
    var user = new User(req.user);
    res.render('home.ejs', { title: 'Home', bread: [], user: user, message: req.flash('loginMessage') });
}

//Routes
router.route('/').get(getHome);

module.exports = function (errCallback){
	console.log('Initializing home routing module');
	
	handleError = errCallback;
	return router;
};