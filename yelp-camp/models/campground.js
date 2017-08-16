var mongoose = require('mongoose');

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	created_at: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Campground', campgroundSchema);