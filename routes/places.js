var express = require('express');
var router = express.Router();
var passport = require('passport');
var request = require('request');
var handleError;
var isJsonRequest;

function getPlaces(req,res){
        
    console.log("Performing api call");
    request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAUAwsmT3dKxsJGxw7Ah1OB19aPomdAHvs&location=' + req.body.location + '&radius=' + req.body.radius + '&type=cafe', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                 res.status(200);
               	if(isJsonRequest(req)){
                     res.json({places: JSON.parse(body).results})
                   }else{
                    res.render('admin/races/waypoint/new', {bread: ['Races', 'New Waypoint'], user:req.body.user, raceid:req.body.raceid, places: JSON.parse(body).results});
                   }
            }
            else {
                res.status(500);
                if(isJsonRequest(req)){
                    res.json({error: error})
                }else{
                    res.render('error', {error: error});
                }
            }
        });
}

router.route('/')
      .post(getPlaces);

module.exports = function (errCallback,jsonChecker){
	console.log('Initializing places routing module');
    isJsonRequest = jsonChecker;
	handleError = errCallback;
	return router;
};