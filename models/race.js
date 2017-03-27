var mongoose = require('mongoose');
console.log('Initializing race schema');

var raceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    waypoints: [{type: String, unique: true}],
    active: {
        type: Boolean,
        default: false
    }
    
});

mongoose.model('Race', raceSchema);
