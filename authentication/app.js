var express          = require('express');
var bodyParser       = require('body-parser');
var expressSanitizer = require('express-sanitizer');
var mongoose         = require('mongoose');
var methodOverride   = require('method-override');
var seedDB           = require("./seeds");
var app              = express();

// Database Setup
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://mongo:27017/project_db_name", {
	keepAlive: true,
	reconnectTries: Number.MAX_VALUE,
	useMongoClient: true
});

// App Config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Database Models
var User = require('./models/user');

seedDB();

app.get('/', function(req, res){
	res.render("index");
});

app.listen(3000, function(){
	console.log('Example app listening on port 3000!');
});