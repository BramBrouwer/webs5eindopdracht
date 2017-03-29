var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var _ = require('underscore');


//Models
User = mongoose.model('User');
Race = mongoose.model('Race');

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

/*
	Tag a a waypoint
	/users/id/races/id/waypoints/id - POST
*/
function tagWaypoint(req,res){
	
	var userid = req.params.id;
	var raceid = req.params.raceid;
	var waypointid = req.body.waypointid;
	console.log(req.params);
	var race;
	var query = {};
	query._id = raceid;
	var result = Race.find(query);	
	result
		.then(data => {
			race = data[0];
			console.log('1');
			var waypoint = race.waypoints.find(waypointid);
			console.log('2');
			if(waypoint){
				waypoint.users.push(userid);
				race.save().then(savedRace => {
					console.log("waypoint tagged");
					res.status(201);
					return res.json({savedRace});
				}).fail(err => {
					res.status(500);
					return res.json({err});
				});
			}else{
				console.log("User has already tagged this waypoint");
				res.status(500);
				return res.json({err: "invalid request"});
			}
		})
		.fail(err => {
			console.log("error finding race");
			res.status(500);
			res.json({err});
		});
}

/*
If the request is valid, push the given user to the given race.waypoints[index].users array
*/
function saveTaggedWaypoint(validRequest,race,valWaypointIndex,userid,res){
		
		if(validRequest){
				race.waypoints[valWaypointIndex].users.push(userid);
				race.save().then(savedRace => {
					console.log("waypoint tagged");
					res.status(201);
					return res.json({savedRace});	
				})
				.fail(err => {
					res.status(500);
					res.json({err});
				});	
			}else{
				res.status(500);
				return res.json({err: "invalid request"});
			}
}

function addRace(req, res){
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

//Routes
router.route('/')
    .get(getUsers)
    .post(addUser);

router.route('/:id')
    .get(getUsers);

router.route('/:id/races')
	.get(getUserRaces)
	.post(addRace);

router.route('/:id/races/:raceid/waypoints')
	.post(tagWaypoint);

module.exports = router;