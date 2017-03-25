var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


//Models
User = mongoose.model('User');

//Functions
function getUsers(req, res){
    var query = {};
	if(req.params.id){
		query._id = req.params.id;
	} 

	var result = User.find(query);

	result
		.then(data => {
			// We hebben gezocht op id, dus we gaan geen array teruggeven.
			if(req.params.id){
				data = data[0];
			}
			return res.json(data);
		})
		.fail(err => handleError(req, res, 500, err));
}

function addUser(req, res){
	var user = new User(req.body);
	user.save()
		.then(savedUser => {
			res.status(201);
			res.json(savedUser);
		})
		.fail(err => handleError(req, res, 500, err));
}

//Routes
router.route('/')
    .get(getUsers)
    .post(addUser);9
	

router.route('/:id')
    .get(getUsers);
	


module.exports = router;