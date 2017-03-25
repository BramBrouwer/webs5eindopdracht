var express = require('express');
var router = express.Router();

//Models
Race = mongoose.model('Race');

//Functions

//API
function getRaces(req, res){
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
			}
			return res.json(data);
		})
		.fail(err => handleError(req, res, 500, err));
}

function addRace(req, res){
	var race = new Race(req.body);
	race.save()
		.then(savedRace => {
			res.status(201);
			res.json(savedRace);
		})
		.fail(err => handleError(req, res, 500, err));
}

//

//Routes
router.route('/')
    .get(getRaces)
    .post(addRace);

router.route('/:id')
    .get(getRaces);

router.route('/new')
    .get(newRaceForm);

module.exports = router;