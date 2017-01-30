var express = require('express');
var router = express.Router();
var passport = require('passport');
var secret = require('../config/secret');
var Users = require('../models/users');
var jwt = require('jsonwebtoken');
var flash = require('connect-flash');

var jwtAuth = passport.authenticate('jwt', { session: false });

router.get('/', passport.authenticate('jwt', 
	{ session: false, 
	successRedirect: '/dashboard',
	failureRedirect: '/login'} 
))

router.get('/', jwtAuth, function(req, res, next) {
	res.redirect('/login');
})

router.get('/secret', function(req, res, next){
	console.log('cooks:', req.cookies);
	next();
});

router.get('/secret', jwtAuth, function(req, res){
  res.json({message: "Success! You can not see this without a token"});
});

router.get('/login', function(req, res) {
	res.render('login.ejs', {message: ''});
});

router.post('/login', function(req, res, next) {
	// console.log('in /login');
	if (!req.body.email)
		res.render( 'login.ejs', {message: 'please fill out email'});
	if (!req.body.password)
		res.render( 'login.ejs', {message: 'please fill out password'});
	var token = jwt.sign({ email: req.body.email }, secret.secret);
	res.cookie('JWT', token);
	res.redirect('/dashboard');
});


router.get('/signup', function(req, res) {
	res.render('signup.ejs');
});

router.get('/profile', jwtAuth, function(req, res) {
	console.log(req.user)
	res.render('profile.ejs', {user: req.user});
});

router.get('/logout', function(req, res) {
	console.log('route: logout');
	res.cookie('JWT', '', {expires: new Date(1)});
	res.redirect('/');
});

router.post('/signup/reg', function(req, res) {
	console.log('signup route', req.body);
	if (!req.body.email || !req.body.password) {
		res.status(400).json({
			success: false, 
			message: 'please enter email and password'
		});
	} else {
		Users.find( {email: req.body.email.toLowerCase()} , function(err, rez) {
			if (err) {
				res.status(400);
			}
			if (rez[0]) {
				console.log('signup: user already exists', rez);
				res.json({
					success: false,
					message: 'email address is already registered'
			})} else {
				console.log('signup: creating new user');
				var newUser = new Users({
					email: req.body.email, 
					password: req.body.password
				});
				newUser.save(function(err) {
					if (err) {
						return res.status(400).json({
							success: false,
							message: 'save failed'
						})
					}
					// payload is a javascript object.  This is a prereq for using the 
					// expires in option
					var token = jwt.sign(
						{ email: newUser.email}, 
						secret.secret
					);
					console.log("sending cookie"); 
					// res.json({message: "ok", token: token});
					res.cookie('JWT', token);
					res.redirect('/dashboard');
					console.log('after cook');
					// res.status(201).json({
					// 	success: true, 
					// 	token: 'JWT ' + token,
					// 	redirect: '/dashboard'
					// });
				});
			}
		});	
	}
});

router.post('/login', passport.authenticate('local-login', {
	successRedirect: '/dashboard',
	failureRedirect: '/login',
	faulureFlash: true,
}))


function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}

module.exports = router;
