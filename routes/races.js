var express = require('express');
var router = express.Router();
var _ = require('underscore');
var mongoose = require('mongoose');
var passport = require('passport');

//Models
Race = mongoose.model('Race');
User = mongoose.model('User');

//Functions

//Get all races/a specific race
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
				if(isJsonRequest(req)){
					res.json({race: data});
				}else{
					res.render(user.role + '/races/race-info.ejs', { title: 'Race', bread: ['Races', 'Race'], user: user, race: data });
					return;
				}
			}
			if(isJsonRequest(req)){
				res.json({races: data});
			}else{
				res.render(user.role + '/races/races.ejs', { title: 'Races', bread: ['Races'], user: user, races: data });
				return;
			}
			
		})
		.fail(err => {
			console.log("error finding races");
			res.status(500);
			res.json({err});
		});
}



//Get waypoints for a specific race 
function getWaypointsForRace(req,res){
	var user = new User(req.user);
	var query = {};
	if(req.params.id){
		query._id = req.params.id;
	}
	var result = Race.find(query);
		result
		.then(data => {
			// We hebben gezocht op id, dus we gaan geen array teruggeven.
			
				data = data[0];
				if(isJsonRequest(req)){
					res.json({waypoints: data.waypoints});
				}else{
					res.render(user.role + '/races/race-info.ejs', { title: 'Race', bread: ['Races', 'Race'], user: user, race: data });
				return;
				}
			
		})
		.fail(err => {
			console.log("error finding race");
			res.status(500);
			res.json({err});
		});
}

function getUsersForWaypoint(req,res){
	var user = new User(req.user);
	var waypointid = req.params.waypointid;
	var query = {};
	if(req.params.id){
		query._id = req.params.id;
	}
	var result = Race.find(query);
		result
		.then(data => {
			
				data = data[0];
	
				for (var i = 0; i < data.waypoints.length; i++){
					console.log(data.waypoints[i]._id);
					console.log(waypointid);
					if (data.waypoints[i]._id == waypointid){
						var waypoint = data.waypoints[i];
					}
				}	
		
				if(isJsonRequest(req)){
					res.json({users: waypoint.users});
				}else{
					res.render(user.role + '/races/race-info.ejs', { title: 'Race', bread: ['Races', 'Race'], user: user, race: data });
				return;
				}
			
		})
		.fail(err => {
			console.log("error finding race");
			res.status(500);
			res.json({err});
		});
}



//Add new race to database
function addRace(req, res){
    //if(req.user.role != "admin") {res.redirect('/');}
	console.log(req.body);
	var race = new Race(req.body);
	race.save()
		.then(savedRace => {
			console.log("New race created");
			res.status(201);
			if(isJsonRequest(req)){
				res.json({race: savedRace});
			}else{
				res.redirect('/races/' + savedRace._id);
			}
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
		res.status(200);
		if(isJsonRequest(req)){
			res.json({response : "Race deleted"})
		}
		else{
			console.log("Race deleted")
			res.json({response : "Race deleted (res.redirect werkt niet na een delete request en handmatig method naar GET veranderen werkt ook niet.)"})
		}
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
	res.render('admin/races/waypoint/new', {bread: ['Races', 'New Waypoint'], user:user, raceid:id, places: []});
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
			console.log('waypoint added');
				if(isJsonRequest(req)){
					res.status(200);
					res.json({response : savedRace})
				}else{
					res.redirect('/races/' + savedRace._id);
				}
			});
		})
		.fail(err => {
			console.log("error getting race");
			res.status(500);
			if(isJsonRequest(req)){
			res.json({err});
			}else{
				res.redirect('/races/' + race._id);
			}
			
		
		});
}

//Update race state
function updateRaceState(req,res){
	if(req.user.role != "admin") {res.redirect('/');}
	var active = req.body.active;
	console.log(active);
	var raceid = req.params.id;
	Race
		.findByIdAndUpdate(
			raceid,
			{ $set: {active: active}},
			{ new: true},
			function (err,race){
				if(err)  return res.json({err});
				console.log("Race started");
				if(isJsonRequest(req)){
					res.status(200);
					res.json({response: race});
				}else{
					res.redirect(req.get('referer'));
				}
				
			})	
}

//Socket call when a waypoint is checked
function logRaceInfo(req,res){
	 var socket = io(process.env.PORT||'http://localhost:3000');
  	socket.on('checkinLogged', function (data) {
    console.log(data.msg);
    socket.emit('checkinLogged', { user: 'user', msg: ' checked in' });
  });
}

function isJsonRequest(req){
      if(req.accepts('html') == 'html'){
          return false;
      }
      return true;
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
	.get(getWaypointsForRace)
	.post(addWaypoint);
	
router.route('/:id/waypoints/:waypointid/users')
	.get(getUsersForWaypoint);

router.route('/:id/state')
	.put(updateRaceState);



module.exports = router;