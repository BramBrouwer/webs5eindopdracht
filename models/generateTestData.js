var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

User = mongoose.model('User');
Race = mongoose.model('Race');


function fillTestUsers(){
	var testData = [
		{
			email : "admin",
			password : bcrypt.hashSync("author",bcrypt.genSaltSync(8),null),
			role : "admin"
		},
		{
			email : "user",
			password : bcrypt.hashSync("user",bcrypt.genSaltSync(8),null)
		}
	]
	
		
	User.find({}).then(data => {
			
         if(data.length == 0){
			console.log('Creating users testdata');
			testData.forEach(function(user){
				new User(user).save();
			});
		} else{
			console.log('Skipping create users testdata, allready present');
		}
	});
    
};
    
    function fillTestRaces(){
        var testData = [
            {
                name: "Race 1",
                waypoints: ["waypoint1.1","waypoint1.2","waypoint1.3"]
            },
            {
                name: "Race 2",
                waypoints: ["waypoint2.1","waypoint2.2","waypoint2.3"]
            },
            {
                name: "Race 3",
                waypoints: ["waypoint3.1","waypoint3.2","waypoint3.3"," waypoint3.4","waypoint3.5","waypoint3.6"]
            }
        ]
        
        Race.find({}).then(data => {
            if(data.length == 0){
			    console.log('Creating races testdata');
			    testData.forEach(function(race){
				new Race(race).save();
			    });
		    } 
            else
            {
			    console.log('Skipping create races testdata, allready present');
		    }
        });
    };
    
    module.exports = function(){
        fillTestRaces();
        fillTestUsers();
}
	
	
