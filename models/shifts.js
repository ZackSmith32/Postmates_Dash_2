var mongoose = require('mongoose');

var shiftSchema = new mongoose.Schema({
	id: Number,
	shiftNumber: Number,
	shiftStart: Date,
	shiftEnd: Date,
	shiftMiles: Number,
	updateDate: {type: Date, default: Date.now},
	addDate: {type: Date, default: Date.now}
});

var Shifts = mongoose.model( 'Shifts' , shiftSchema)

module.exports = Shifts;