var express = require('express');
var router  = express.Router({mergeParams: true});
var Comment = require('../models/comment');
var Campground = require('../models/campground');

//=================
// COMMENTS ROUTES
//=================

// NEW ROUTE
router.get('/new', isLoggedIn, function (req,res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
		if (err) {
			console.log(err);
		}
		else {
			console.log(campground);
			res.render('comments/new', {campground: campground});
		}
	});

});

// CREATE ROUTE
router.post('/', isLoggedIn, function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
		if (err) {
			console.log(err);
		}
		else {
			req.body.comment.text = req.sanitize(req.body.comment.text);
			Comment.create(req.body.comment, function (err, comment) {
				if (err) {
					console.log(err);
				}
				else {
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/' + req.params.id);
				}
			});
		}
	});
});

/**
 * Auth Function
 */
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

module.exports = router;