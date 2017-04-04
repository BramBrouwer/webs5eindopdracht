// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
console.log('Initializing user schema');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        name         : String,
        password     : String,
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    role: {
        type: String,
        default: "user"
    },
    races: [{type: mongoose.Schema.Types.ObjectId, ref: 'Race'}]
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.statics.findByLocalName = function(name,callback){
    return this.find({'local.name' : name},callback);
}

userSchema.statics.findByRole = function(role,callback){
    return this.find({role : role},callback);
}

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema); 