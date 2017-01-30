var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = express.Router();
var Jobs = require('../models/jobs.js')
var passport = require('passport');
var secret = require('../config/secret');
var Users = require('../models/users');
var jwt = require('jsonwebtoken');

var jwtAuth = passport.authenticate('jwt', 
	{ session: false, failureRedirect: '/login' });

router.get('/', jwtAuth, function(req, res, next) {
	var user
	if (req.user.admin) {
		user = '';
	} else {
		user = req.user.email;
	}
	allJobs(user)
		.then(function(allJobs) {
			res.render('dashboard', {
				allJobs: allJobs
			})
		}).catch(function(error) {console.log('route', error)})
})

function allJobs(user) {
	return new Promise (function(resolve, reject) {
		Jobs.find({userID: user}, function(err, data){
			if (err) {
				console.log('all jobs:', err)
				reject (new Error(msg))}
			else {
				//console.log(data)
				resolve(data)
			}
		})
	})
}

module.exports = router;