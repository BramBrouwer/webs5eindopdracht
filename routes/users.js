var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var _ = require('underscore');
var handleError;
var app;
//Models
User = mongoose.model('User');
Race = mongoose.model('Race');

//Functions
function getUsers(req, res){
    var query = {};
	if(req.params.id){
		query._id = req.params.id;
	} 

	if(req.query.localname){ //Check if request contains a country, if it does call the static method in author model
		User.findByLocalName(req.query.localname, function(err, data) 
		{
			if(err) return handleError(req,res,500,err);
				res.json({response: data});
		})	
	}else{

	var result = User.find(query);
	result
		.then(data => {
			// We hebben gezocht op id, dus we gaan geen array teruggeven.
			if(req.params.id){
				data = data[0];
			}
			if(isJsonRequest(req)){	
				return res.json({response: data});
			}else{
				return res.json({response: data});  //Er is geen user view
			}
		})
		.fail(err => handleError(req, res, 500, err));
	}
}

function addUser(req, res){
	var user = new User(req.body);
	user.save()
		.then(savedUser => {
			res.status(201);
			if(isJsonRequest(req)){	
				return res.json({response: savedUser});
			}else{
				return res.json({response: savedUser}); //Er is geen view om te registreren, alleen wat pre aangemaakte lokale accounts en inloggen via social signin dus dit is neit relevant
			}
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
			
			if(isJsonRequest(req)){	
				return res.json({response: data});
			}else{
			res.render(user.role + '/races/races.ejs', { title: 'Races', bread: ['Races', 'My Races'], user: user, races: data });
			return;
			}
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
			for (var i = 0; i < race.waypoints.length; i++){
				if (race.waypoints[i]._id == waypointid){
					var waypoint = race.waypoints[i];
				}
			}
			if(waypoint && !(JSON.stringify(waypoint.users).includes(userid))){
				waypoint.users.push(userid);
				race.save().then(savedRace => {
					logRace(userid,waypoint.name,race._id);  //Log waypoint name and userid to socket
					console.log("waypoint tagged");
					res.status(200);
					if(isJsonRequest(req)){	
						return res.json({response: savedRace});
					}else{
						return res.redirect('/races/' + raceid);
					}
				}).fail(err => handleError(req, res, 500, err));
			}else{
				console.log("User has already tagged this waypoint");
				res.status(500);
				return res.json({err: "invalid request"});
			}
		})
		.fail(err => handleError(req, res, 500, err));
}
/*
Join race
*/
function addRace(req, res){
	var query = {};
	query._id = req.body.userid;
	var user = User.find(query);
	user
		.then(data => {
			data = data[0];
			data.races.push({_id: req.body.raceid, name: req.body.racename});
			data.save().then(savedUser => {
				res.status(200);
				if(isJsonRequest(req)){	
					res.json({response: savedUser});
				}else{
					res.redirect('/races/' + req.body.raceid);
				}
			});
		})
		.fail(err => handleError(req, res, 500, err));
}
/*
TODO: geef de process.env.PORT door aan view
*/
function logRace(userid,waypointname,raceid){
		app.io.sockets.emit('checkinLogged'+raceid,{msg: "User: " + userid + " checked in at: "+ waypointname});
}

function isJsonRequest(req){
      if(req.accepts('html') == 'html'){
          return false;
      }
      return true;
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

router.route('/log')
	.get(logRace);

module.exports = function (appin,errCallback){
	console.log('Initializing user routing module');
	app=appin;
	handleError = errCallback;
	return router;
};