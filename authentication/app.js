var express = require('express');
var bodyParser = require('body-parser');
var expressSanitizer = require('express-sanitizer');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
// var seedDB = require("./seeds");
var app = express();

// Database Setup
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://mongo:27017/authentication", {
	keepAlive: true,
	reconnectTries: Number.MAX_VALUE,
	useMongoClient: true
});

// App Config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(require("express-session")({
	secret: "Custom Secret Text for Your App",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Database Models
var User = require('./models/user');

// Passport Setup
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Database Seeding
// seedDB();

/**
 * Routes
 */
app.get('/', function (req, res) {
	res.render("index");
});

app.get('/secret', isLoggedIn, function (req, res) {
	res.render("secret");
});

/**
 * Register Routes
 */
app.get('/register', function (req, res) {
	res.render("signup");
});

app.post('/register', function (req, res) {
	User.register(new User({ username: req.body.username }), req.body.password, function (err, newUser) {
		if (err) {
			console.log(err);
			return res.render("signup");
		} else {
			passport.authenticate("local")(req, res, function () {
				res.redirect("/secret");
			});
		}
	});
});


/**
 * Login Routes
 */
app.get('/login', function (req, res) {
	res.render("login");
});

app.post('/login', passport.authenticate("local", {
	successRedirect: "/secret",
	failureRedirect: "/login"
}), function (req, res) {
});

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});