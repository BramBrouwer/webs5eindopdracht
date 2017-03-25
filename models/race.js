var mongoose = require('mongoose');
console.log('Initializing race schema');

var raceSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Waypoints: [{type: String, unique: true}],
    Active: {
        type: Boolean,
        default: false
    }
    
});

mongoose.model('Race', raceSchema);
