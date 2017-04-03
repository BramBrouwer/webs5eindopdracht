var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('../index');
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
User = mongoose.model('User');
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

describe('Testing users route', function(){
    describe('GET', function(){
        describe('without params', function(){
            it('should return all users', function(done){
                    requestGET('/', 200, done());
            });
        });
        describe('with invalid params', function(){
            it('should return 500 when ID is invalid', function(done){
                requestGET('/users/invalidID', 500, done());
            });
            it('should return 500 when ID is invalid', function(done){
                requestGET('/users/invalidID/races', 500, done());
            });
        });
        describe('with valid params', function(){
            it('should return the right user', function(done){
                user = User.find({}).then(data => {
                    userID = data[0]._id;
                    requestGET('/users/' + userID, 200, done())
                });
            });
            it('should return the right races', function(done){
                    requestGET('/' + userID + '/races', 200, done());
            });
        });
    });
    describe('POST', function(){
        describe('without params', function(){
            it('should post and return a new user', function(done){
                var body = 
                {
                    local: {
                                email        : 'test@mail.com',
                                name         : 'test',
                                password     : 'test',
                                }
                };
                requestPOST('/users', body, 200, done());
            });
        });
        describe('with invalid params', function(){
            it('should return 500 when ID is invalid', function(done){
                var body = { raceid: 'invalidID', racename: 'invalidName' };
                requestPOST('/invalidID/races', body, 500, done());
            });
            it('should return 500 when body is invalid', function(done){
                var body = {invalid: 'body'};
                requestPOST('/' + userID + '/races', body, 500, done());
            });
        });
        describe('with valid params', function(){
            it('should post and return a race', function(done){
                Race.find({}).then(data => {
                    raceID = data[0]._id;
                    waypoints = data[0].waypoints;
                    var body = {raceid:  data[0]._id, racename: data[0].name};
                    requestPOST('/' + userID + '/races', body, 200, done());
                });
            });
            it('should post and return a waypoint', function(done){
                User.find({}).then(data => {
                    var body = {waypointid: waypoints[0]._id};
                    requestPOST('/users/' + userID + '/races/' + raceID + '/waypoints' , body, 200, done());
                });
            });
        });
    });
    describe('PUT', function(){
    });
});