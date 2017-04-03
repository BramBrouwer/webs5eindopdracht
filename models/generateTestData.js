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
                name: "Kroegentocht Best",
                active: true,
                waypoints : [
                    {
                        googleid: "5543566d06a8242ef09600a1d0ce1b0fe3258fa8",
                        name:     "Knooppunt Café"
                    },
                    {
                        googleid: "111cd096cf991886deb6bc6e47ed5237aac608b8",
                        name:     "Café Manus"
                    },
                    {
                        googleid: "a713bc3bcd44417e58d6994d486fc6a31f6c8984",
                        name:     "Café Dokus"
                    },
                    {
                        googleid: "432b495ea2e318220181d70a9c03399a25847580",
                        name:     "Eethuis Tel Aviv"
                    }
                ]
            },
            {
                name: "Kroegentocht Eindhoven",
                waypoints : [
                    {
                        googleid: "79ea320093e1c4c14a81bc830b8371a01ca5545b",
                        name:     "Coffeeshop Pink"
                    },
                     {
                        googleid: "8a823d119cc1bfe1d9a3eda00f4d7c4ee79cf7f7",
                        name:     "Grand Café Centraal"
                    },
                     {
                        googleid: "31aaa41add9cd6a52258748ca087944ab0a50038",
                        name:     "Proeflokaal De Gaper"
                    },
                    {
                        googleid: "932369a8796417d9b2bda890534e3ed0a11f4e0d",
                        name:     "Hoogste Tijd"
                    },
                    {
                        googleid: "e71503a24330e6e93e052dbd8326cc172b8cba8e",
                        name:     "Café 't Vonderke"
                    },
                    {
                        googleid: "8c2ac0968d015b1be81e06990bf3557823afb447",
                        name:     "De Steakfabriek"
                    }
                ]
            },
            {
                name: "Random Kroegentocht"
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
	
	
