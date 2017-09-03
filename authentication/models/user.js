var mongoose = require('mongoose');

// USER SCHEMA
var userSchema = new mongoose.Schema({
	email: String,
	name: String
});

module.exports = mongoose.model("User", userSchema);