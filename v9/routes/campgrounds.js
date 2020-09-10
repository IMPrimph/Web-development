var express = require("express")
var router = express.Router();
var Campground = require("../models/campgrounds")
var middleware = require("../middleware")

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
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form
	//add to campgrounds
	//redirect
	var name = req.body.name
	var image = req.body.image
	var description = req.body.description
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image, description: description, author: author}
	//console.log(req.user)
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err)
		}
		else{
			// redirecting back to campgrounds
			//console.log(newlyCreated)
			res.redirect("/campgrounds")
		}
	})
	//campgrounds.push(newCampground)
	//res.redirect("/campgrounds")
})

//NEW - Show form to create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new")
})

//SHOW - shows more information about the campground
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found")
			res.redirect("back")
			//console.log(err)
		}
		else{
			//console.log(foundCampground)
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground})
		}
	})
	
})

//Edit campground router
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
		Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground})
		})
	})

//Update campground router
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, 		updatedCampground){
		if(err){
			res.redirect("/campgrounds")
		}
		else{
			res.redirect("/campgrounds/" + req.params.id)
		}
	})
	//find and update the correct campground
	//redirect to show page
})

//campground delete route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndDelete(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds")
		}
		else{
			res.redirect("/campgrounds")
		}
	})
})


module.exports = router