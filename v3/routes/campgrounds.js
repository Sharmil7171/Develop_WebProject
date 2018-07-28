var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

//Index Route 
router.get("/",function(req,res){
    Campground.find({},function(err,campgrounds){
       if(err){
           console.log("ERROR!");
       } else {
           res.render("campgrounds/index", {campgrounds:campgrounds});
       }
    });
});

//New Route
router.get("/new",middleware.isLoggedIn,function(req, res) {
    res.render("campgrounds/new");
});

//Create Route
router.post("/",middleware.isLoggedIn,function(req,res) {
     Campground.create(req.body.campground, function(err, newCampground){
        if(err){
            res.render("campgrounds/new");
        }else{
             //add username and id to campground
                  newCampground.author.id = req.user._id;
                  newCampground.author.username = req.user.username;
                  newCampground.save();
                  
                  console.log(newCampground);
            res.redirect("/campgrounds");
        }
    });
});


//Show Route
router.get("/:id", function(req, res) {
    
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err || !foundCampground){
            req.flash("error","Campground not found.")
            res.redirect("/campgrounds");
        } else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//Edite Route
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err || !foundCampground){
            res.redirect("/campgrounds");
        } else{
                res.render("campgrounds/edit", {campground: foundCampground});
        }
    }); 
});

//Update Route
router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground , function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           req.flash("success","Campground successfully updated.");
           res.redirect("/campgrounds/"+ req.params.id);
       }
    });
});


//Delete Route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else {
            req.flash("success","Campground is successfully deleted.");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;


