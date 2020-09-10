var express = require("express")
var app = express();
var bodyParser = require('body-parser')
var Campground = require("./models/campgrounds")
var seedDB = require("./seeds2")
//var mongoose = require('mongoose');
//seedDB();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp_camp_v3', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}))


app.set("view engine", "ejs")

	// var campgrounds = [
	// 	{name:"Salmon Greek", image: "https://encrypted-tbn0.gstatic.com/images?			q=tbn%3AANd9GcT4rbM1V8XTQJgGUIf1i245KQfwo240Ni0zrw&usqp=CAU"},
	// 	{name: "Abhi", image: "https://encrypted-tbn0.gstatic.com/images?			q=tbn%3AANd9GcT4rbM1V8XTQJgGUIf1i245KQfwo240Ni0zrw&usqp=CAU"},
	// 	{name: "Taj Krishna", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSkTolu6NA6EgVaBNz4M_EdZMBV3RRZQMrCag&usqp=CAU"},
	// 	{name: "Abhi", image: "https://encrypted-tbn0.gstatic.com/images?			q=tbn%3AANd9GcT4rbM1V8XTQJgGUIf1i245KQfwo240Ni0zrw&usqp=CAU"},
	// 	{name: "Taj Krishna", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSkTolu6NA6EgVaBNz4M_EdZMBV3RRZQMrCag&usqp=CAU"},
	// 	{name: "Abhi", image: "https://encrypted-tbn0.gstatic.com/images?			q=tbn%3AANd9GcT4rbM1V8XTQJgGUIf1i245KQfwo240Ni0zrw&usqp=CAU"},
	// 	{name: "Taj Krishna", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSkTolu6NA6EgVaBNz4M_EdZMBV3RRZQMrCag&usqp=CAU"},
	// 	{name: "Taj Krishna", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSkTolu6NA6EgVaBNz4M_EdZMBV3RRZQMrCag&usqp=CAU"}
	// ]

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
			res.render("index", {campgrounds: allCampgrounds})
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
	res.render("new.ejs")
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
			res.render("show", {campground: foundCampground})
		}
	})
	
})
app.listen(3000, function(){
	console.log("The Yelpcamp Server started listening")
})