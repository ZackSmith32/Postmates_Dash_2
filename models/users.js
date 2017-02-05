var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
	email: {
		type: String,
		lowercase: true,
		unique: true,
	},
	password: String,
	facebook: {
		id: String, 
		token: String,
		first_name: String,
		last_name: String
	},
	market: String,
	name: String,
	admin: {
		type: Boolean,
		default: false
	}, 
	token: String
});

// generate a hash
userSchema.pre('save', function(next) {
	var user = this;
	if (!this.password)
		return next();
	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(10, function (err, salt) {
			if (err) {
				return next(err);
			}
			bcrypt.hash(user.password, salt, function(err, hash) {
				if (err) {
					return next(err);
				}
				user.password = hash;
				next();
			});
		});
	} else {
		return next();
	}
})

// check if password is valid
userSchema.methods.comparePassword = function(password, cb) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('User', userSchema);