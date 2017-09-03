var mongoose = require('mongoose');
var User     = require('./models/user');

var data = [];
function seedDB() {
	// Clear all User entries
	User.remove({}, function(err) {
		if (err) {
			console.log(err);
		}
		else {
			console.log("User Removed!");
			data.forEach(function(seed) {
				User.create(seed, function(err, newCampground) {
					if (err){
						console.log(err);
					}
					else {
						console.log("User created!");
					}
				});
			});
		}
	});
}

module.exports = seedDB;
