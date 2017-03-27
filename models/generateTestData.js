var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

User = mongoose.model('User');
Race = mongoose.model('Race');

function fillTestUsers(){
	var testData = [
		{
			local : {
                email: "admin",
                name: 'Ad Min',
                password : bcrypt.hashSync("admin",bcrypt.genSaltSync(8),null)
            },
			role : "admin"
		},
		{
			local : {
                email: "user",
                name: 'Us Er',
                password : bcrypt.hashSync("user",bcrypt.genSaltSync(8),null)
            },
			role : "user"
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
                name: "Race 1"
            },
            {
                name: "Race 2"
            },
            {
                name: "Race 3",
                waypoints: [{googleid: "waypoint3.1",name: "waypoint3.2"}]
            }, 
            {
                name: "Race 4"
            },
            {
                name: "Race 5"
            },
            {
                name: "Race 6"
            },
            {
                name: "Race 7"
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
	
	
