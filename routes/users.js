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



function tagWaypointNew(req,res){
	var userid = {_id: req.params.id}
	var raceid = req.params.raceid;
	var waypointid = req.params.waypointid;
	var race;
	var query = {};
	query._id = raceid;
	
	Race
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

//Routes
router.route('/')
    .get(getUsers)
    .post(addUser);9
	
router.route('/:id')
    .get(getUsers);

router.route('/:id/races/:raceid/waypoints/:waypointid')
	.post(tagWaypoint);

module.exports = router;