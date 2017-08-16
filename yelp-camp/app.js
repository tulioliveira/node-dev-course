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

// INDEX ROUTE
app.get('/', function(req, res){
	Campground.find({}, function(err, results) {
		if (err) {
			console.log(err);
		}
		else {
			res.render("index", {campgrounds: results});
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
			console.log(campground);
			res.render("show", {campground: campground})		
		}
	})
});


app.listen(3000, function(){
	console.log('Example app listening on port 3000!');
});