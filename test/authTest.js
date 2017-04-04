var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('../index');
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
Race = mongoose.model('Race');


function requestGET(route, statusCode, done){
	request(app)
		.get(route)
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return done(err); }
			done(null, res);
		});
};
function requestPOST(route, body, statusCode, done){
	request(app)
		.post(route)
        .send(body)
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return done(err); }
			done(null, res);
		});
};
function requestDELETE(route, statusCode, done){
	request(app)
		.delete(route)
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return done(err); }
			done(null, res);
		});
};
describe('Testing authorization', function(){
    describe('login as user', function(){
        it('should return 200 with valid body', function(done){
            var body = {email: 'user', password: 'user'};
            requestPOST('/login', body, 200, done());
        });
    });
    describe('should give authorization error', function(){
        it('adding a race', function(done){
            var body = {name: 'mocha test race'};
            requestPOST('/races', body, 403, done());
        });
        it('adding a waypoint to a race', function(done){
            var body = {googleid: 'google id', name: 'mocha test race'};
            races = Race.find({});
            races.then(data => {
                requestPOST('/races/' + data[0]._id + '/waypoints', body, 400, done());
            });
        });
        it('deleting a race', function(done){
            races = Race.find({});
            races.then(data => {
                requestDELETE('/' + data[data.length-1]._id, 403, done());
            });
        });

    });

});