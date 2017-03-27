var mongoose = require('mongoose');
console.log('Initializing waypoint schema');

var waypointSchema = new mongoose.Schema({
    googleid: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    }
    
});

mongoose.model('Waypoint', waypointSchema);
