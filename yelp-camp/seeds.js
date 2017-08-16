var mongoose   = require('mongoose');
var Campground = require('./models/campground');
var Comment    = require('./models/comment');

var data = [
	{
		name: "Cloud's Rest",
		image: "http://oddculture.com/wp-content/uploads/2015/12/Camping-Near-The-Lake-Background-Wallpaper.jpg",
		description: "Random Description for the camp"
	},
	{
		name: "Mountain's Mesa",
		image: "http://www.wildnatureimages.com/images%203/060731-346..jpg",
		description: "Random Description for the camp"
	},
	{
		name: "Hitch's Lake",
		image: "https://cdn-jpg2.theactivetimes.com/sites/default/files/camping.jpg",
		description: "Random Description for the camp"
	},
	{
		name: "Cloud's Rest",
		image: "http://oddculture.com/wp-content/uploads/2015/12/Camping-Near-The-Lake-Background-Wallpaper.jpg",
		description: "Random Description for the camp"
	},
	{
		name: "Mountain's Mesa",
		image: "http://www.wildnatureimages.com/images%203/060731-346..jpg",
		description: "Random Description for the camp"
	},
	{
		name: "Hitch's Lake",
		image: "https://cdn-jpg2.theactivetimes.com/sites/default/files/camping.jpg",
		description: "Random Description for the camp"
	}
]
function seedDB() {
	// Clear all Campground entries
	Campground.remove({}, function(err) {
		if (err) {
			console.log(err);
		}
		else {
			console.log("Campgrounds Removed!");
			data.forEach(function(seed) {
				Campground.create(seed, function(err, newCampground) {
					if (err){
						console.log(err);
					}
					else {
						console.log("Campground created!");
						Comment.create({
							text: "This place is great! Too bad it doesn't have internet....",
							author: "Homer"
						}, function (err, comment) {
							if (err) {
								console.log(err);
							}
							else {
								newCampground.comments.push(comment);
								newCampground.save();
							}
						});
					}
				});
			});
		}
	});
}

module.exports = seedDB;
