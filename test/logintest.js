var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
var app = require('../index');
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;

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
describe('Testing login route', function(){
    describe('POST', function(){
        describe('with invalid params', function(){
            it('should return error 500 with invalid body', function(done){
                var body = {email: 'invalidemail', password: 'invalidpass'};
                requestPOST('/login', body, 500, done());
            });
        });
        describe('with valid params', function(){
            it('should return 200 with valid body', function(done){
                var body = {email: 'admin', password: 'admin'};
                requestPOST('/login', body, 200, done());
            });
        });
    });
});