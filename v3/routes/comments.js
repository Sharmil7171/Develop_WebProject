var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");

//NEW Route for Comment
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground: foundCampground});
        }
    });
    
});

//Create Route for Comment
router.post("/",middleware.isLoggedIn,function(req,res) {
    Campground.findById(req.params.id,function(err, campground) {
        if(err){
            req.flash("error","Something went wroing!");
            console.log(err);
        }else{
           // console.log(req.body.comment);
           Comment.create(req.body.comment,function(err, comment){
               if(err){
                   console.log(err);
               }else{
                  //add username and id to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                   
                   //save comment 
                   comment.save();
                   
                   campground.comments.push(comment);
                   campground.save();
                   req.flash("success", "Comment successfully added.")
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
        }
    });
});


//Edit Route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Campground.findById(req.params.id,function(err, campground) {
        if(err || !campground) {
            req.flash("error","No Campground Found");
            return res.redirect("back");
        }
         Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err || !foundComment){
            console.log(err);
        }else {
            res.render("comments/edit", {campground_id: req.params.id, comment:foundComment});
        }
    });
    });
});

//Update Route
router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);     
        }
    });
});

//Delete Route
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }else {
            req.flash("success","Commnet deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports = router;