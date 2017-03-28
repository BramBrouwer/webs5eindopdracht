var express = require('express');
var router = express.Router();
var passport = require('passport');

function getPlaces(req,res){
    console.log("Performing api call");
    res.status(201);
    res.json({});
}


router.route('/')
      .get(getPlaces);
        







module.exports = router;