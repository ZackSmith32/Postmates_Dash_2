var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = express.Router();
var Jobs = require('../models/jobs.js');
var passport = require('passport');

var jwtAuth = passport.authenticate('jwt', 
	{ session: false, failureRedirect: '/login' });


router.get('/', jwtAuth, function(req, res, next) {
	var user_email = req.user.email;
	allJobs(user_email)
		.then(function(allJobs) {
			//console.log(allJobs)
			res.render('jobList', {
				allJobs: allJobs
			})
		}).catch(function(error) {console.log(error)})
});

router.get('/', jwtAuth, function(req, res, next) {
	Jobs.update(
		{_id: req[0]},
		{$set: {
			jobPayout: req[1],
			jobTip: req[2]
		}},
		function(err) {
			if (err) {return console.log(err)}
			return 'success'
		}
	)
	res.send('success')
});

function allJobs(user_email) {
	return new Promise (function(resolve, reject) {
		Jobs.find({userID: user_email}, function(err, data){
			if (err) {
				console.log(err)
				reject (new Error(msg))}
			else {
				//console.log(data)
				resolve(data)
			}
		})
	})
};

module.exports = router;