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
				allJobs: allJobs, 
				title: 'jobList',
				email: user_email
			})
		}).catch(function(error) {console.log(error)})
});

router.post('/', jwtAuth, function(req, res, next) {
	// console.log(req.body)
	Jobs.update(
		{_id: req.body.id},
		{$set: {
			jobPayout: req.body.jobPayout,
			jobTip: req.body.jobTip
		}},
		function(err, job) {
			if (err) {
				console.log(err)
				next(err) 
			}
			console.log(job._id);
			res.send(job._id);
		}
	)
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