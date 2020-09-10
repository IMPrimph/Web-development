var express = require("express")
var app = express();
var bodyParser = require('body-parser')
var passport = require("passport")
var LocalStrategy = require("passport-local")
var Campground = require("./models/campgrounds")
var seedDB = require("./seeds")
var Comment = require("./models/comment")
var User = require("./models/user")

//requiring routes
var commentRoutes 	  = require("./routes/comments"),
	campgroundRoutes  = require("./routes/campgrounds"),
	indexRoutes		  = require("./routes/index")
//var mongoose = require('mongoose');
//seedDB();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp_camp_v7', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}))


app.set("view engine", "ejs")
app.use(express.static(__dirname +"/public"))

//Passport configuration
app.use(require("express-session")({
	secret: "Hire the people who believe in your idea",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//passing the variable currentUser to every route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
})

//telling our app to use the routes
app.use("/", indexRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)
app.use("/campgrounds", campgroundRoutes)

app.listen(3000, function(){
	console.log("The Yelpcamp Server started listening")
})