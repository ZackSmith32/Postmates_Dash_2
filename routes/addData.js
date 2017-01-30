var express = require('express');
var router = express.Router();
var fs = require('fs')
var mongoose = require('mongoose');
var Shifts = require('../models/shifts.js');
var Jobs = require('../models/jobs.js');
var moment = require('moment')
var passport = require('passport');


var output = fs.readFileSync('./merchantDict.txt', 'utf8')
var parsedOutput = JSON.parse(output)
//console.log(parsedOutput)

var jwtAuth = passport.authenticate('jwt', 
	{ session: false, failureRedirect: '/login' });


// var merchantList9 = getJSONData(parsedOutput, 'Merchant')
// console.log(merchantList9)

// render page
// see notes -> javascript -> promises

router.get('/', jwtAuth, function(req, res, next) {
		var user_email = req.user.email;
		shiftNumberMax(user_email)
			.then(function(result) {return jobData(result, user_email)})
			//.then(function(result) {return merchantList(result)})
			.then(function(result) {
				res.render(
					'addData', { 
			        title: 'Add Data', 
			       	shiftNumber: result[0],
			       	jobData: result[1],
			       	merchantDict: parsedOutput
		    	}
		    )
			})
			.catch(function(error) {console.log(error)})
			// tried putting the res.render in a function, but
			// that wasn't working...
			// there is an optimization here.  Merchant list is not 
			// dependent so it could be run at the same time as the
			// other two queries

});


function shiftNumberMax(user_email) {
	return new Promise(function(resolve, reject) {
		var shiftNumber
		Jobs.findOne({userID: user_email})
			.sort({shiftNumber: -1})
			.exec(function(err, data) {
				if (err) {
					console.log(err)
					reject(new Error(msg))
				}
				else {
					if (data)
						shiftNumber = data.shiftNumber;
					else
						shiftNumber = 1;
						
					console.log('shiftNumberMax '+shiftNumber)
					resolve(shiftNumber)
				}
			})
	})
}

function jobData(shiftNumber, user_email) {
	console.log('in jobData ' + shiftNumber + user_email)
	return new Promise(function(resolve, reject) {
		
		Jobs.find({ shiftNumber: shiftNumber, userID: user_email},
			function(err, data) {
				if (err) reject(new Error(msg))
				else {
					//console.log('this should be before render' + data)
					resolve([shiftNumber, data])
				}
			}
		)
	})			
}

function merchantList(result) {
	console.log('merchantList ')
	return new Promise(function(resolve, reject) {
		Jobs.distinct('jobMerchant', {}, function(err, data) {
			if (err) {
				console.log(err)
				reject(new Error(msg))
			}
			else {
				result.push(data)
				console.log(result[1])
				resolve(result)
			}
		})
	})
}




// router.get('/', function(req, res, next) {

// 	shiftNumberMax(function jobData(shiftNumber) {
			
// 		Jobs.find({ shiftNumber: shiftNumber},
// 			function(err, data) {
// 				if (err) console.log(err)
// 				res.render(
// 					'addData', { 
// 			        title: 'Add Data', 
// 			       	shiftNumber: shiftNumber,
// 			       	jobData: data})
			
// 		})
// 	})    
	

// });




// if new shift then add 1 to shift number
router.post('/', jwtAuth, function(req, res, next) {
	console.log('new shift ' + req.body.newShiftSubmit)
	if(req.body.newShiftSubmit) {
		res.render('addData', { 
        	title: 'Add Data', 
       		shiftNumber: Number(req.body.firstShiftNumber) + 1,
       		jobData: [],
       		merchantDict: parsedOutput
       	})
		
	} else next()

})

//save 'Shift' data to database
// router.post('/', function(req, res, next) {

//     console.log(req.body.shiftNumber)

// 	var newShift = new Shifts({
// 		shiftNumber: req.body.shiftNumber,
// 		shiftMiles: req.body.shiftMiles
// 	})

// 	newShift.save(function (err, shift){
// 		if (err) console.log(err);
// 		else console.log(shift)
// 	})
// 	next()
// })

// save 'Job' data to database
router.post('/', jwtAuth, function(req, res, next) {

	console.log('post job, route: addData')
	console.log(req.body)
	var pending
	var jobTip

	// if pending tip = 0, otherwise take tip from form
	if (req.body.jobTipPending) {
		jobTip = 0
	} else { 
		jobTip = Number(req.body.jobTip)}
	
	// calculated fields
	var jobTotal = jobTip + Number(req.body.jobPayout)
	
	var jobStart = req.body.jobStart
	var jobEnd = req.body.jobEnd
	var jobTime = moment(jobEnd).diff(moment(jobStart))
	var jobLengthHours = moment.duration(jobTime).as('hours')
	console.log('moment' , jobLengthHours)
	console.log('start + end ' + jobStart + jobEnd)
	console.log('job category ' + req.body.jobCategory)
	console.log('job shift Number ' + req.body.jobShiftNumber)
	var shiftNumber = Number(req.body.jobShiftNumber)

	console.log("req.user: " + req.user);
	var newJob = new Jobs({
		userID: req.user.email,
		shiftNumber: req.body.jobShiftNumber,
		jobLengthHours: jobLengthHours,
		jobStart: req.body.jobStart,
		jobEnd: req.body.jobEnd,
		jobMerchant:  req.body.jobMerchant,
		jobCategory: req.body.jobCategory,
		jobPayout: Number(req.body.jobPayout),
		jobTip: jobTip,
		jobMultiplier: Number(req.body.jobMultiplier),
		jobTipPending: isTrue(req.body.jobTipPending),
		jobTotal: jobTotal,
		jobCancel: isTrue(req.body.jobCancel),
		jobPromotion: isTrue(req.body.jobPromotion),
		jobTest: isTrue(req.body.jobTest),
	})
	console.log('job about to be saved:', newJob);
	newJob.save(function (err, job){
		if (err) console.log(err)
		else console.log(job)
		console.log('in save')
		res.redirect('/addData')
	})

})

router.delete('/', jwtAuth, function( req, res, next) {
	console.log(req.body._id)
	Jobs.findByIdAndRemove( req.body._id, function(err) {
		if (err) console.log(err)
		console.log('deleted ' + req.body._id)
	})
	res.send('success')
})

// function declerations
var isTrue = (field) => {
	var bool = field
	if (bool) {
		bool = true
		return bool} 
	else {
		bool = false	
		return bool}
}


module.exports = router;