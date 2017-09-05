var express  = require('express');
var router   = express.Router();
var passport = require('passport');
var User     = require('../models/user');

//==============
// INDEX ROUTES
//==============
/**
 * MAIN PAGE
 */
router.get('/', function(req,res){
	res.redirect('/campgrounds');
});

/**
 * AUTH ROUTES
 */
// Sign Up Form
router.get('/register', function (req, res) {
	res.render('register');
});

// Sign Up Logic Handling
router.post('/register', function (req, res) { 
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function() {
			res.redirect('/campgrounds');
		});
	});
});

// Login Form
router.get('/login', function (req, res) {
	res.render('login');
});

// Login Logic Handling
router.post('/login', passport.authenticate('local', {
	successRedirect: '/campgrounds',
	failureRedirect: '/login'
}), function (req, res) {});

// Logout Logic Handling
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/campgrounds');
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