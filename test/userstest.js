var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('express')();
var users = require('../routes/users');
app.use('/', users);
User = mongoose.model('User');

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
                users = User.find({});
                users.then(expectedData => {
                    requestGET('/', 200, function(err, res){
                        if(err){ return done(err); }
                        expect(res.body).to.have.property('users');
                        expect(res.body.users).to.not.be.undefined;
                        expect(res.body.users).to.equal(expectedData);
                        done();
                    });
                });
            });
        });
        describe('with invalid params', function(){
            it('should return 400 when ID is invalid', function(done){
                requestGET('/users/invalidID', 400, done);
            });
            it('should return 400 when ID is invalid', function(done){
                requestGET('/users/invalidID/races', 400, done);
            });
        });
        describe('with valid params', function(){
            it('should return the right user', function(done){
                user = User.find({}).then(data => {
                    expectedData = data[0];
                    userID = expectedData._id;
                    requestGET('/' + userID, 200, function(err, res){
                        if(err){ return done(err); }
                        expect(res.body).to.have.property('users');
                        expect(res.body.users).to.not.be.undefined;
                        expect(res.body.users).to.equal(expectedData);
                        done();
                    })
                });
            });
            it('should return the right races', function(done){
                user = User.find({}).then(data => {
                    user = data[0];
                    userID = user._id;
                    expectedData = user.waypoints;
                    requestGET('/' + userID + '/races', 200, function(err, res){
                        if(err){ return done(err); }
                        expect(res.body).to.have.property('races');
                        expect(res.body.races).to.not.be.undefined;
                        expect(res.body.races).to.equal(expectedData);
                        done();
                    })
                });
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
                var expectedData = new User(body);
                requestPOST('/', body, 200, function(err, res){
                    if(err){ return done(err); }
                    expect(res.body).to.have.property('user');
                    expect(res.body.user).to.not.be.undefined;
                    expect(res.body.user.local.email).to.equal(expectedData.local.email);
                    done();
                });
            });
        });
        describe('with invalid params', function(){
            it('should return 400 when ID is invalid', function(done){
                var body = { raceid: 'invalidID', racename: 'invalidName' };
                requestPOST('/invalidID/races', body, 400, done);
            });
            it('should return 400 when body is invalid', function(done){
                var body = {invalid: 'body'};
                user = User.find({});
                user.then(data => {
                    userID = data[0]._id;
                    requestPOST('/' + userID + '/races', body, 400, done);
                });
            });
        });
        describe('with valid params', function(){
            it('should post and return a race', function(done){
                var user = User.find({}).then(data => {
                    var body = {raceid:  data[0].races[0]._id, racename: data[0].races[0].name};
                    var expectedData = {_id: data[0].races[0]._id, name: data[0].races[0].name};
                    requestPOST('/' + user._id + '/races', body, 200, function(err, res){
                        if(err){ return done(err); }
                        expect(res.body).to.have.property('user');
                        expect(res.body.user.races).to.not.be.undefined;
                        expect(res.body.user.races[res.body.user.races.length - 1]).to.equal(expectedData);
                        done();
                    });
                });
            });
            it('should post and return a waypoint', function(done){
                var user = User.find({}).then(data => {
                    var body = {id:  data[0]._id, raceid: data[0].name, waypointid: ''};
                    requestPOST('/' + user._id + '/races/' + data[0].races[0]._id + '/waypoints' , body, 200, function(err, res){
                        if(err){ return done(err); }
                        expect(res.body).to.have.property('race');
                        expect(res.body.race.waypoints[0].users).to.not.be.undefined;
                        expect(res.body.race.waypoints[0].users[0]).to.equal(body);
                        done();
                    });
                });
            });
        });
    });
    describe('PUT', function(){
    });
});