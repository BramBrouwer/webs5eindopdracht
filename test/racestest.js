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

describe('Testing races route', function(){
    describe('GET', function(){
        describe('without params', function(){
            it('should return all races', function(done){
                requestGET('/races', 200, done());
            });
        });
        describe('with invalid params', function(){
            it('should return 500 when ID is invalid', function(done){
                requestGET('/races/invalidID', 500, done());
            });
            it('should return 500 when ID is invalid', function(done){
                requestGET('/races/invalidID/watpoints', 500, done());
            });
            it('should return 500 when ID is invalid', function(done){
                requestGET('/races/invalidID/watpoints/invalidID/users', 500, done());
            });
        });

        describe('with valid params', function(){
            Race.find({}).then(data => {
                raceID = data[0]._id;
                waypointID = data[0].waypoints[0]._id;
                it('should return the right race', function(done){
                        requestGET('/races/' + raceID, 200, done());
                });
                it('should return the right waypoints', function(done){
                    requestGET('/races/' + raceID + '/waypoints', 200, done());
                });
                it('should return the right users', function(done){
                    requestGET('/races/' + raceID + '/waypoints/' + waypointID + '/users', 200, done());
                });
            });
        });
    });
    describe('POST', function(){
        describe('without params', function(){
            it('should post and return a new race', function(done){
                var body = {name: 'mocha test race'};
                requestPOST('/races', body, 200, done());
            });
        });
        describe('with invalid params', function(){
            it('should return 500 when ID is invalid', function(done){
                var body = {name: 'mocha test waypoint'};
                requestPOST('/races/invalidID/waypoints', body, 500, done());
            });
            it('should return 500 when body is invalid', function(done){
                var body = {invalid: 'body'};
                requestPOST('/races/' + raceID + '/waypoints', body, 500, done);
            });
        });
        describe('with valid params', function(){
            it('should post and return a new waypoint', function(done){
                var body = {googleid: 'google id', name: 'mocha test race'};
                var expectedData = new Race(body);
                requestPOST('/races/' + raceID + '/waypoints', body, 200, done());
            });
        });
    });
    describe('PUT', function(){
    });
    describe('DELETE', function(){
        describe('with invalid params', function(){
            it('should return 500 when ID is invalid', function(done){
                requestDELETE('/races/invalidID', 500, done());
            });
        });
        describe('with valid params', function(){
            it('should post and return a new waypoint', function(done){
                var expectedData = 'Race deleted';
                races = Race.find({});
                races.then(data => {
                    requestDELETE('/' + data[data.length-1]._id, 200, done());
                });
            });
        });
    });
});