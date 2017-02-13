var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = express.Router();
var Jobs = require('../models/jobs.js')
var passport = require('passport');
var Users = require('../models/users');
var jwt = require('jsonwebtoken');
var fs = require('fs');

var jwtAuth = passport.authenticate('jwt', 
	{ session: false, failureRedirect: '/login' });

var heat_map = fs.readFileSync('./heat_data.tsv', 'utf8')

router.get('/', jwtAuth, function(req, res, next) {
	var user
	if (req.user.admin) {
		user = '';
	} else {
		user = req.user.email;
	}
	allJobs(user)
		.then(function(result) {return heat_data(result)})
		.then(function(allJobs) {
			console.log(user);
			res.render('dashboard', { 
				allJobs: allJobs, 
				title: 'dashboard',
				email: user
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

function heat_data(data) {
	console.log('in heat format func');
	var heat_data = [['day', 'time', 'payout', 'tips', 'total', 'time', 'rate']]
	return new Promise( function(resolve, reject) {
		for (var day = 1; day <= 7; day++) {
			for (var time = 1; time <= 24; time++) {
				var filtered = data.filter(function(job) {
					// console.log(job.jobStart.getDay())
					return 	job.jobStart.getDay() == day &&
							job.jobStart.getHours() == time
				})
				var payout = 0;
				var tips = 0;
				var time = 0;
				for (job of filtered) {
					tips += job.jobTip;
					payout += job.payout;
					time += job.jobLengthHours;
				}
				var total = payout + tips;
				var rate = total / time;
				console.log(filtered);
				heat_data.push([day, time, 0, tips, payout + tips, time, rate]);
			}
		}
		console.log('heat data', heat_data)
		resolve(heat_data);
	})
}

module.exports = router;





































