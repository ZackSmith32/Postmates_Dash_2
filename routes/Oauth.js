var express = require('express');
var router = express.Router();
var passport = require('passport');
var Users = require('../models/users');


router.get('/facebook', passport.authenticate('facebook', 
	{ scope: ['email'] }
	));

router.get('/facebook/callback', passport.authenticate('facebook', 
	{ 	session: false,
		failureRedirect: '/login' }),
	function(req, res) {
		console.log('req in callback route',req.user);
		res.cookie('JWT', req.user.my_token);
		res.redirect('/dashboard');
	}

)

module.exports = router;
