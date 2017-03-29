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
	var waypointid = req.params.waypointid;
	var race;
	var query = {};
	query._id = raceid;
	var valWaypointIndex;  //waypoint that we need to edit
	var validRequest = true; //Will be set to false if the user has already tagged this waypoint
	var result = Race.find(query);	
	result
		.then(data => {
			race = data[0];
			//First lets check if the waypoint were looking for actually exists in this race
			var c  = 0;
			race.waypoints.forEach(function(waypoint) {
				
				if(waypoint._id == waypointid){ 	//Check if race actually contains waypoint were looking for
					valWaypointIndex = c;			//For some reason saving the waypoint reference in a var and using it to push() later doesnt work so save the index
					waypoint.users.forEach(function(user) {
						console.log(user._id);
						if(user._id == userid){
							console.log("user has already tagged this waypoint")
							validRequest = false;	//User id found in this waypoints collection, invalidate request
						}
					})
				}
				c++;
			});
			
			saveTaggedWaypoint(validRequest,race,valWaypointIndex,userid,res); 		
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

router.route('/:id/races/:raceid/waypoints/:waypointid')
	.post(tagWaypoint);

module.exports = router;