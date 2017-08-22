var express          = require('express');
var bodyParser       = require('body-parser');
var expressSanitizer = require('express-sanitizer');
var mongoose         = require('mongoose');
var methodOverride   = require('method-override');
var seedDB           = require("./seeds");
var app              = express();

// Database Setup
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://mongo:27017/yelp_camp", {
	keepAlive: true,
	reconnectTries: Number.MAX_VALUE,
	useMongoClient: true
});
var Campground = require('./models/campground');
var Comment    = require('./models/comment');

// App Config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

seedDB();

// MAIN PAGE
app.get('/', function(req,res){
	res.redirect('/campgrounds');
});

// INDEX ROUTE
app.get('/campgrounds', function(req, res){
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
app.get('/campgrounds/new', function (req,res) {
	res.render('campgrounds/new');
});

// CREATE ROUTE
app.post('/campgrounds', function(req, res) {
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
app.get('/campgrounds/:id', function(req,res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
		if (err) {
			console.log(err);
		}
		else {
			res.render("campgrounds/show", {campground: campground});		
		}
	});
});
//=================
// COMMENTS ROUTES
//=================

// NEW ROUTE
app.get('/campgrounds/:id/comments/new', function (req,res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
		if (err) {
			console.log(err);
		}
		else {
			res.render('comments/new', {campground: campground});
		}
	});
	
});

// CREATE ROUTE
app.post('/campgrounds/:id/comments', function(req, res) {
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

app.listen(3000, function(){
	console.log('Example app listening on port 3000!');
});