var express = require('express');
var router = express.Router();
var passport = require('passport');
var request = require('request');




function getPlaces(req,res){
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