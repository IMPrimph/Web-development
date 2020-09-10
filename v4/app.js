var express = require("express")
var app = express();
var bodyParser = require('body-parser')
var Campground = require("./models/campgrounds")
var seedDB = require("./seeds2")
var Comment = require("./models/comment")
//var mongoose = require('mongoose');
//seedDB();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp_camp_v4', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}))


app.set("view engine", "ejs")
app.use(express.static(__dirname +"/public"))
//console.log(__dirname)

app.get("/", function(req, res){
	res.render("landing")
})

//INDEX PAGE - SHOW ALL CAMPGROUNDS
app.get("/campgrounds", function(req, res){
	//Getting all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err)
		}
		else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds})
		}
	})
	//res.render("campgrounds", {campgrounds: campgrounds})
})

//CREATE - ADD NEW CAMPGROUND TO DATABASE
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new")
})

//SHOW - shows more information about the campground
app.get("/campgrounds/:id", function(req, res){
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

//===========================
//Comments routes
//===========================
app.get("/campgrounds/:id/comments/new", function(req, res){
	//find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
		}
		else{
			res.render("comments/new", {campground: campground})
		}
	})

})

app.post("/campgrounds/:id/comments", function(req, res){
	//look up campground using id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
			res.redirect("/campgrounds")
		}
		else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err)
				}
				else{
					campground.comments.push(comment)
					campground.save()
					res.redirect("/campgrounds/" + campground._id)
				}
			})
		}
	})
	//create new comment
	//connect new comment to campground
	//redirect to show page
})

app.listen(3000, function(){
	console.log("The Yelpcamp Server started listening")
})