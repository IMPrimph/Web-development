var express = require("express")
var router = express.Router();
var Campground = require("../models/campgrounds")

//INDEX PAGE - SHOW ALL CAMPGROUNDS
router.get("/", function(req, res){
	//Getting all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err)
		}
		else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user})
		}
	})
	//res.render("campgrounds", {campgrounds: campgrounds})
})

//CREATE - ADD NEW CAMPGROUND TO DATABASE
router.post("/", function(req, res){
	//get data from form
	//add to campgrounds
	//redirect
	var name = req.body.name
	var image = req.body.image
	var description = req.body.description
	var newCampground = {name: name, image: image, description: description}
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err)
		}
		else{
			// redirecting back to campgrounds
			res.redirect("/campgrounds")
		}
	})
	//campgrounds.push(newCampground)
	//res.redirect("/campgrounds")
})

//NEW - Show form to create a new campground
router.get("/new", function(req, res){
	res.render("campgrounds/new")
})

//SHOW - shows more information about the campground
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err)
		}
		else{
			//console.log(foundCampground)
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground})
		}
	})
	
})
//login middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
	   return next();
	   }
	   res.redirect("/login")
}

module.exports = router