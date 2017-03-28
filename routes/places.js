var express = require('express');
var router = express.Router();
var passport = require('passport');
var request = require('request');

/*
    Possible query strings:
    latLgnBounds - search nearby 
*/

 function initMap() {
        var pyrmont = {lat: -33.867, lng: 151.195};

        map = new google.maps.Map(document.getElementById('map'), {
          center: pyrmont,
          zoom: 15
        });

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: pyrmont,
          radius: 500,
          type: ['store']
        }, callback);
      }
      
       function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      }



function getPlaces(req,res){
    
    //TODO check query string variables 
    
    console.log("Performing api call");
    
    request('http://www.google.com', function (error, response, body) {
        if(error)return res.json({error});
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
    
    
    res.status(201);
    res.json({});
}












router.route('/')
      .get(getPlaces);
        







module.exports = router;