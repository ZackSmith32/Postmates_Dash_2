var mongoose = require('mongoose');

var jobSchema = new mongoose.Schema({
	userID: String,
	shiftNumber: { type: Number, required: true},
	jobStart: Date,
	jobEnd: Date,
	jobLengthHours: Number,
	jobMerchant: String,
	jobCategory: String,
	jobPayout: Number,
	jobTip: Number,
	jobMultiplier: Number,
	jobTipPending: Boolean,
	jobTotal: Number,
	jobCancel: Boolean,
	jobPromotion: Boolean,
	updated_at: Date,
	created_at: Date,
	jobTest: Boolean,
});

jobSchema.pre('save', function(next) {
	var currentDate = new Date()

	this.updated_at = currentDate

	if (!this.created_at)
		this.created_at = currentDate

	next()
});

module.exports = mongoose.model( 'Jobs' , jobSchema);