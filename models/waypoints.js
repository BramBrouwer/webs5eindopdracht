/*
Bij het aanmaken van een race gebruikt de user de autocompleter om een waypoint te krijgen 
Na het toevoegen van waypoints wordt de race opgeslagen en de waypoints ook 
Daarna kan er mss nog een waypoint CRUD pagina komen maar daar zie ik nu het nut niet van in 
*/
var mongoose = require('mongoose');
console.log('Initializing waypoint schema');

var raceSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        name: String,
        required: true
    }
    
});

mongoose.model('Waypoint', raceSchema);
