var passport = require('passport');
var passportJwt = require("passport-jwt");
var ExtractJwt = passportJwt.ExtractJwt;
var JwtStrategy = passportJwt.Strategy;
var Users = require("../models/users.js");
var secret = require("./secret.js");

var cookieExtractor = function(req) {
	// console.log("cookieExtractor:", req.cookies);
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['JWT'];
    }
    // console.log(token);
    return token;
};

var jwtOptions = {}
jwtOptions.jwtFromRequest = cookieExtractor;
jwtOptions.secretOrKey = secret.secret;

module.exports = (function( passport ) {
	
	var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, done) {
	    // console.log('payload received', jwt_payload);
	    Users.findOne({email: jwt_payload.email}, function(err, user) {
	        // console.log('auth strategy');
	        if (user) {
	            done( null, user);
	        } else {
	            done( null, false);
	        }
	    });
	});
	passport.use(strategy);
})



