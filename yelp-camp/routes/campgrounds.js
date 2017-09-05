var express    = require('express');
var router     = express.Router();
var Campground = require('../models/campground');

//===================
// CAMPGROUNDS ROUTES
//===================

// INDEX ROUTE
router.get('/', function(req, res){
	Campground.find({}, function(err, results) {
		if (err) {
			console.log(err);
		}
		else {
			res.render("campgrounds/index", {campgrounds: results});
		}
	});
});

// NEW ROUTE
router.get('/new', function (req,res) {
	res.render('campgrounds/new');
});

// CREATE ROUTE
router.post('/', function(req, res) {
	req.body.campground.description = req.sanitize(req.body.campground.description);
	Campground.create(req.body.campground, function(err, newCampground) {
		if (err){
			res.render("campgrounds/new");
		}
		else {
			res.redirect("/campgrounds");
		}
	});
});

// SHOW ROUTE
router.get('/:id', function(req,res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
		if (err) {
			console.log(err);
		}
		else {
			res.render("campgrounds/show", {campground: campground});
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