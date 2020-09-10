var express = require("express")
var app = express();
var bodyParser = require('body-parser')
//var mongoose = require('mongoose');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs")

//SCHEMA setup

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
})

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// {
// 	name: "Animatic_camp_ground",
// 	image: "https://pixabay.com/get/54e4d0434a4faa0df7c5d575c62b3e7f123ac3e45658744e70297ed595_340.png",
// 	description: "This is a prototype of campground tent. All the best for your adventure!!"
// },function(err, campground){
// 	if(err){
// 		console.log(err);
// 	}
// 	else{
// 		console.log("Hello Newbie")
// 		console.log(campground)
// 	}
// })

	var campgrounds = [
		{name:"Salmon Greek", image: "data:image/jpeg;base64,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"},
		{name: "Abhi", image: "https://encrypted-tbn0.gstatic.com/images?			q=tbn%3AANd9GcT4rbM1V8XTQJgGUIf1i245KQfwo240Ni0zrw&usqp=CAU"},
		{name: "Taj Krishna", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSkTolu6NA6EgVaBNz4M_EdZMBV3RRZQMrCag&usqp=CAU"},
		{name: "Abhi", image: "https://encrypted-tbn0.gstatic.com/images?			q=tbn%3AANd9GcT4rbM1V8XTQJgGUIf1i245KQfwo240Ni0zrw&usqp=CAU"},
		{name: "Taj Krishna", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSkTolu6NA6EgVaBNz4M_EdZMBV3RRZQMrCag&usqp=CAU"},
		{name: "Abhi", image: "https://encrypted-tbn0.gstatic.com/images?			q=tbn%3AANd9GcT4rbM1V8XTQJgGUIf1i245KQfwo240Ni0zrw&usqp=CAU"},
		{name: "Taj Krishna", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSkTolu6NA6EgVaBNz4M_EdZMBV3RRZQMrCag&usqp=CAU"},
		{name: "Taj Krishna", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSkTolu6NA6EgVaBNz4M_EdZMBV3RRZQMrCag&usqp=CAU"}
	]

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
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err)
		}
		else{
			res.render("show", {campground: foundCampground})
		}
	})
	
})
app.listen(3000, function(){
	console.log("The Yelpcamp Server started listening")
})