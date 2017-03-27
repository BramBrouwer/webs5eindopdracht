var express = require('express');
var router = express.Router();
var _ = require('underscore');
var mongoose = require('mongoose');
var passport = require('passport');

//Models
Race = mongoose.model('Race');
//Functions

//Page for creating a new race 
function getNewRace(req,res){
var user = new User(req.user);
	if(user.role == "admin"){
		res.render('admin/races/new',{bread: ['Races'],user:user});
	}else{
		res.render('/');
	}
}
//Page for adding waypoint to race
function getNewWaypoint(req,res){
var user = new User(req.user);
var id = req.params.id;
	if(user.role == "admin"){
		res.render('admin/races/newwaypoint',{bread: ['Races'],user:user,raceId:id});
	}else{
		res.render('/');
	}
}

//Get all races TODO: pagination/filtering
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
			res.render('' +user.role + '/races/races.ejs', { title: 'Races', bread: ['Races'], user: user, races: data });
			return;
		})
		.fail(err => handleError(req, res, 500, err));
}

//Post new race/add race to database
function addRace(req, res){
	var race = new Race(req.body);
	race.save()
		.then(savedRace => {
			console.log("New race created");
			res.status(201);
			res.json(savedRace);
		})
		.fail(err => handleError(req, res, 500, err));
}

/*
Get the race object so we can append the new waypoint object to waypoints array
*/
function addWaypoint(req,res){
	var race;
	var query = {};
	query._id = req.params.id;
	var waypoint = {};
	waypoint.googleid = req.body.googleid;
	waypoint.name = req.body.name;
	console.log(waypoint);
	
	var result = Race.find(query);
	
	result
		.then(data => {
			race = data[0];
			var curWaypoints = race.waypoints;
			console.log(curWaypoints);
			console.log("Race retrieved, creating new waypoint");
			createNewWaypoint(waypoint,res,race._id,curWaypoints); 
		})
		.fail(err => handleError(req, res, 500, err));
}
/*
Add waypoint to the waypoints array and update race record in the database
*/
function createNewWaypoint(waypoint,res,raceId,curWaypoints){
				
		curWaypoints.push(waypoint);  //Add to existing list of waypoints
		
		Race
		.findByIdAndUpdate(
			raceId,
			{ $set: {waypoints: curWaypoints}},
			{ new: true},
			function (err,race){
				if(err)  return handleError(err);
				res.status(201);
				res.json(race);
			})	
}

//Routes
router.route('/')
    .get(getRaces)
    .post(addRace);

router.route('/new')
	.get(getNewRace);
	
router.route('/:id')
    .get(getRaces);
	
router.route('/:id/waypoints/new')
.get(getNewWaypoint)
.post(addWaypoint);


module.exports = router;