var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('express')();
var races = require('../routes/races');
app.use('/', races);
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
                races = Race.find({});
                races.then(expectedData => {
                    requestGET('/', 200, function(err, res){
                        if(err){ return done(err); }
                        expect(res.body).to.have.property('races');
                        expect(res.body.races).to.not.be.undefined;
                        expect(res.body.races).to.equal(expectedData);
                        done();
                    });
                });
            });
        });
        describe('with invalid params', function(){
            it('should return 400 when ID is invalid', function(done){
                requestGET('/races/invalidID', 400, done);
            });
            it('should return 400 when ID is invalid', function(done){
                requestGET('/races/invalidID/watpoints', 400, done);
            });
            it('should return 400 when ID is invalid', function(done){
                requestGET('/races/invalidID/watpoints/invalidID/users', 400, done);
            });
        });
        describe('with valid params', function(){
            it('should return the right race', function(done){
                race = Race.find({}).then(data => {
                    expectedData = data[0];
                    raceID = expectedData._id;
                    requestGET('/races/' + raceID, 200, function(err, res){
                        if(err){ return done(err); }
                        expect(res.body).to.have.property('race');
                        expect(res.body.race).to.not.be.undefined;
                        expect(res.body.race).to.equal(expectedData);
                        done();
                    })
                });
            });
            it('should return the right waypoints', function(done){
                race = Race.find({}).then(data => {
                    race = data[0];
                    raceID = race._id;
                    expectedData = race.waypoints;
                    requestGET('/races/' + raceID + '/waypoints', 200, function(err, res){
                        if(err){ return done(err); }
                        expect(res.body).to.have.property('waypoints');
                        expect(res.body.waypoints).to.not.be.undefined;
                        expect(res.body.waypoints).to.equal(expectedData);
                        done();
                    })
                });
            });
            it('should return the right users', function(done){
                race = Race.find({}).then(data => {
                    race = data[0];
                    waypoint = race.waypoints[0];
                    raceID = race._id;
                    waypointID = waypoint._id;
                    expectedData = waypoint.users;
                    requestGET('/races/' + raceID + '/waypoints/' + waypointID + '/users', 200, function(err, res){
                        if(err){ return done(err); }
                        expect(res.body).to.have.property('users');
                        expect(res.body.users).to.not.be.undefined;
                        expect(res.body.users).to.equal(expectedData);
                        done();
                    })
                });
            });
        });
    });
    describe('POST', function(){
        describe('without params', function(){
            it('should post and return a new race', function(done){
                var body = {name: 'mocha test race'};
                var expectedData = new Race(body);
                requestPOST('/', body, 200, function(err, res){
                    if(err){ return done(err); }
                    expect(res.body).to.have.property('race');
                    expect(res.body.race).to.not.be.undefined;
                    expect(res.body.race.name).to.equal(expectedData.name);
                    done();
                });
            });
        });
        describe('with invalid params', function(){
            it('should return 400 when ID is invalid', function(done){
                var body = {name: 'mocha test waypoint'};
                requestPOST('/races/invalidID/waypoints', body, 400, done);
            });
            it('should return 400 when body is invalid', function(done){
                var body = {invalid: 'body'};
                race = Race.find({});
                race.then(data => {
                    raceID = data[0]._id;
                    requestPOST('/races/' + raceID + '/waypoints', body, 400, done);
                });
            });
        });
        describe('with valid params', function(){
            it('should post and return a new waypoint', function(done){
                var body = {name: 'mocha test race'};
                var expectedData = new Race(body);
                requestPOST('/', body, 200, function(err, res){
                    if(err){ return done(err); }
                    expect(res.body).to.have.property('race');
                    expect(res.body.race).to.not.be.undefined;
                    expect(res.body.race.name).to.equal(expectedData.name);
                    done();
                });
            });
        });
    });
    describe('PUT', function(){
    });
    describe('DELETE', function(){
        describe('with invalid params', function(){
            it('should return 400 when ID is invalid', function(done){
                requestDELETE('/races/invalidID', 400, done);
            });
        });
        describe('with valid params', function(){
            it('should post and return a new waypoint', function(done){
                var expectedData = 'Race deleted';
                races = Race.find({});
                races.then(data => {
                    for(var i=0; i < data.length;i++){
                        if(data[i].name == "mocha test race"){
                            requestDELETE('/' + data[i]._id, 200, function(err, res){
                                if(err){ return done(err); }
                                expect(res.body).to.have.property('response');
                                expect(res.body.response).to.not.be.undefined;
                                expect(res.body.response).to.equal(expectedData);
                                done();
                            });
                        }
                    }
                });
            });
        });
    });
});