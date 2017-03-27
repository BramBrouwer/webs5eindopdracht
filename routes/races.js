var express = require('express');
var router = express.Router();
var _ = require('underscore');
var mongoose = require('mongoose');
var passport = require('passport');

//Models
Race = mongoose.model('Race');
User = mongoose.model('User');

//Functions

//API
function getRaces(req, res){
	var user = new User(req.user);
    var query = {};
	if(req.params.id){
		query._id = req.params.id;
	}

	var result = Race.find(query);

	result
		.then(data => {
			// We hebben gezocht op id, dus we gaan geen array teruggeven.
			if(req.params.id){
				data = data[0];
				res.render(user.role + '/races/race-info.ejs', { title: 'Race', bread: ['Races', 'Race'], user: user, race: data });
				return;
			}
			res.render(user.role + '/races/races.ejs', { title: 'Races', bread: ['Races'], user: user, races: data });
			return;
		})
		.fail(err => handleError(req, res, 500, err));
}

function addRace(req, res){
	var race = new Race(req.body);
	race.save()
		.then(savedRace => {
			res.status(201);
			res.json(savedRace);
		})
		.fail(err => handleError(req, res, 500, err));
}

function addUser(req, res){
	var query = {};
	query._id = req.body.userid;
	var user = User.find(query);
	user
		.then(data => {
			data = data[0];
			data.races.push({_id: req.body.raceid, name: req.body.racename});
			data.save().then(savedUser => {
				res.redirect('/races/' + req.body.raceid);
			});
		})
		.fail(err => handleError(req, res, 500, err));
}

function getUserRaces(req, res){
	var user = new User(req.user);
	var raceids = [];
	for(var i=0;i < user.races.length;i++){
		raceids.push(user.races[i]._id);
	}
    var query = {_id: {$in: raceids.map(function(id){ return mongoose.Types.ObjectId(id);})}};
	var result = Race.find(query);
	result
		.then(data => {
			// We hebben gezocht op id, dus we gaan geen array teruggeven.
			res.render(user.role + '/races/races.ejs', { title: 'Races', bread: ['Races', 'My Races'], user: user, races: data });
			return;
		})
		.fail(err => handleError(req, res, 500, err));
}

//Routes
router.route('/')
    .get(getRaces)
    .post(addRace);

router.route('/user')
		.get(getUserRaces);
router.route('/user/new')
		.post(addUser);
router.route('/:id')
    .get(getRaces);



module.exports = router;