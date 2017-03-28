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

/*
O
Acces a specific users race collection 
select specific race 
access its waypoints collection 
select a specific waypoints
update the waypoints user array (add the current user)
*/
function tagWaypoint(req,res){
	
	var userid = req.params.id;
	var raceid = req.params.raceid;
	var waypointid = req.params.waypointid;
	var race;
	var query = {};
	query._id = raceid;
	//Miscchien moet je echt het user object ophalen en daar de id van gebruiken?
	//Find race by id --> update waypoint record
	var result = Race.find(query);
	result
		.then(data => {
			race = data[0];
			//Find the waypoint with the given waypointid
			race.waypoints.forEach(function(curWaypoint) {
    			if(curWaypoint._id == waypointid){
					curWaypoint.users.push(userid);
					console.log(curWaypoint.users);
				}
			});
			race.save().then(savedRace => {
			console.log("race updated");
			res.status(201);
			res.json(savedRace);
		})
		.fail(err => {
			console.log("error updating race");
			res.status(500);
			res.json({err});
		});
	})
	.fail(err => {
		console.log("error getting race");
		res.status(500);
		res.json({err});
	});
	
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