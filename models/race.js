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
        name : String,
        users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    }]
});

raceSchema.statics.findByName = function(name,callback){
    return this.find({name: name},callback);
}

raceSchema.statics.findByIsActive = function(state,callback){
    return this.find({active: state},callback);
}

mongoose.model('Race', raceSchema);
