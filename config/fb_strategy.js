var passport = require('passport');
var facebookStrategy = require("passport-facebook");
var Users = require("../models/users.js");
var secret_key = process.env.SECRET_KEY;
var jwt = require('jsonwebtoken');


var options = {
	clientID: process.env.FACEBOOK_APP_ID,
	clientSecret: process.env.FACEBOOK_APP_SECRET,
	callbackURL: '/auth/facebook/callback',
	profileFields: ['id', 'emails', 'name']
}

module.exports = ( function(passport) {
	passport.serializeUser(function(user, done) {
	  done(null, user);
	})

	passport.deserializeUser(function(user, done) {
	  done(null, user);
	})

	passport.use(new facebookStrategy (
		options, 
		function(accessToken, refreshToken, profile, done) {
			// console.log('profile:', profile);
			process.nextTick(function() {
				Users.findOne(
					{ 'email': profile.emails[0].value }, 
					function (err, result) {
						var user = profile;
						if (err)
							return done(err);
						if (result) {
							user.my_token = jwt.sign(
								{ email: result.email}, 
								secret_key
							);
							console.log('user exists done(null , user), user =', user)
							done(null, user);
							
						} else {
							var newUser = new Users();
							newUser.facebook.id = profile.id;
							newUser.facebook.token = accessToken;
							newUser.facebook.first_name = profile.name.givenName;
							newUser.facebook.last_name = profile.name.familyName;
							newUser.my_token = jwt.sign(
								{ email: result.email}, 
								secret_key
							);
							if (profile.emails){
								console.log('emails exists!');
								newUser.email = profile.emails[0].value;
							} else {
								console.log('no email');
								done(404)
							}
							console.log('callback:', newUser);
							newUser.save(function(err) {
								if (err)
									throw (err);
								done(null, newUser);
							})
						}
					}
				)
			})
		}
	))
})

