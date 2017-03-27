var mongoose = require('mongoose');
console.log('Initializing race schema');

var raceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
    waypoints: [{
        googleid: String,
        name : String
    }]
});

mongoose.model('Race', raceSchema);
