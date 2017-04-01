var express = require('express');
var router = express.Router();
var passport = require('passport');
var request = require('request');
var handleError;

function getPlaces(req,res){
    
    //TODO check query string variables 
    
    console.log("Performing api call");

    request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAUAwsmT3dKxsJGxw7Ah1OB19aPomdAHvs&location=' + req.body.location + '&radius=' + req.body.radius + '&type=cafe', function (error, response, body) {
            if (!error && response.statusCode == 200) {
               	res.render('admin/races/waypoint/new', {bread: ['Races', 'New Waypoint'], user:req.body.user, raceid:req.body.raceid, places: JSON.parse(body).results});
            }
            else {
                console.log("Fout bij ophalen Google Waypoints API");
            }
        });
}

router.route('/')
      .post(getPlaces);

module.exports = function (errCallback){
	console.log('Initializing places routing module');
	
	handleError = errCallback;
	return router;
};