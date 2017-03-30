var express = require('express');
var router = express.Router();
var _ = require('underscore');
var mongoose = require('mongoose');
var passport = require('passport');

//Models
Race = mongoose.model('Race');
User = mongoose.model('User');

//Functions

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
			console.log(data);
			res.render(user.role + '/races/races.ejs', { title: 'Races', bread: ['Races'], user: user, races: data });
			return;
		})
		.fail(err => {
			console.log("error finding races");
			res.status(500);
			res.json({err});
		});
}

//Add new race to database
function addRace(req, res){
    //if(req.user.role != "admin") {res.redirect('/');}
	
	var race = new Race(req.body);
	race.save()
		.then(savedRace => {
			console.log("New race created");
			res.status(201);
			res.redirect('/races/' + savedRace._id);
			//res.json(savedRace);
		})
		.fail(err => {
			console.log("error creating race");
			res.status(500);
			res.json({err});
		});
}

//Page for creating a new race 
function getNewRace(req,res){
	var user = new User(req.user);
  	if(user.role != "admin") {res.redirect('/');}
	res.render('admin/races/new',{bread: ['Races'],user:user});
}

//Delete race (via ajax request)
function deleteRace(req,res){
	console.log('debug');
	if(req.user.role != "admin") {res.redirect('/');}
	Race.remove({ _id: req.params.id }, function(err) {
    if (!err) {
           console.log("Race deleted")
			res.status(201);
    }
    else {
			console.log('error deleting race')
			res.status(500);  
			res.json({err});
 		}
	});
}

//Page for adding waypoint to race
function getNewWaypoint(req,res){
	var user = new User(req.user);
	if(user.role != "admin") {res.redirect('/');}
	var id = req.params.id;
	res.render('admin/races/waypoint/new', {bread: ['Races', 'New Waypoint'], user:user, raceId:id, places: []});
}

function addWaypoint(req,res){
	if(req.user.role != "admin") {res.redirect('/');}
	
	var race;
	var query = {};
	query._id = req.params.id;
	var waypoint = {};
	waypoint.googleid = req.body.googleid;
	waypoint.name = req.body.name;

	var newWaypoint =         {
            "googleid" : req.body.googleid,
            "name" : req.body.name,
            "users" : []
        };
	
	var result = Race.find(query);
	
	result
		.then(data => {
			race = data[0];
			var curWaypoints = race.waypoints;
			race.waypoints.push(newWaypoint);
			race.save().then(savedRace => {
				res.redirect('/races/' + savedRace._id);
			});
		})
		.fail(err => {
			console.log("error getting race");
			res.status(500);
			res.json({err});
		});
}

//Update race state
function updateRaceState(req,res){
	if(req.user.role != "admin") {res.redirect('/');}
	var active = req.body.active;
	var raceId = req.params.id;
	Race
		.findByIdAndUpdate(
			raceId,
			{ $set: {active: active}},
			{ new: true},
			function (err,race){
				if(err)  return res.json({err});
				console.log("Race started");
				res.status(201);
				res.json(race);
			})	
}

function logRaceInfo(req,res){
	
}

//Routes
router.route('/')
    .get(getRaces)
    .post(addRace);

router.route('/new')
	.get(getNewRace);

router.route('/:id')
    .get(getRaces)
	.delete(deleteRace);
router.route('/:id/waypoints/new')
	.get(getNewWaypoint);

router.route('/:id/waypoints')
	.post(addWaypoint);

router.route('/:id/state')
	.post(updateRaceState);



module.exports = router;