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
		.then(function(result) {
			allJobs_return = result[0];
			heat_data_json = result[1];
			// console.log('heat_data', heat_data_json);
			// console.log('allJobs', allJobs_return);
			res.render('dashboard', { 
				allJobs: allJobs_return, 
				title: 'dashboard',
				email: user,
				heat_data: heat_data_json
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
	var heat_data_json = []
	// var heat_data = [['day', 'time', 'payout', 'tips', 'total', 'time', 'rate', 'count']]
	return new Promise( function(resolve, reject) {
		for (var day = 0; day < 7; day++) {
			for (var hour = 0; hour < 24; hour++) {
				var temp = {};
				var filtered = data.filter(function(job) {
					// console.log('hour:', job.jobStart.getUTCHours(), 'day:', job.jobStart.getDay())
					return 	(	job.jobStart.getDay() == day &&
								job.jobStart.getUTCHours() == hour)
				})
				if (day == 7){
					console.log('filtered:', filtered);
				}
				var payout = 0;
				var tips = 0;
				var hours = 0;
				for (var i = 0; i < filtered.length; i++) {
					payout += filtered[i].jobPayout;
					tips += filtered[i].jobTip;
					hours += filtered[i].jobLengthHours;
				}
				var total = payout + tips;
				var rate = hours ? total / hours : 0;
				temp.day = day + 1;
				temp.hour = hour + 1;
				temp.payout = payout;
				temp.tips = tips;
				temp.time = hours;
				temp.value = total;
				temp.rate = rate;
				temp.count = i;
				heat_data_json.push(temp);
			}
		}

		// console.log('json data:', heat_data_json);
		resolve([data, heat_data_json]);
	})
}

module.exports = router;





































