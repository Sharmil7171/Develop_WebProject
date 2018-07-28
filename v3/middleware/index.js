var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next) {
    //If the campground is provided by same loggein person then only he can able to update/delete it.
     if(req.isAuthenticated()){
        Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
            if(err || !foundCampground){
                req.flash("error","Campground not found.");
                res.redirect("back");
            } else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });   
    } else{
        req.flash("error","You need to login first.");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req,res,next) {
    //If the comment is provided by same loggein person then only he can able to update/delete it.
     if(req.isAuthenticated()){
         console.log("I am here");
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err || !foundComment){
                req.flash("error","Comment not found.");
                res.redirect("back");
            } else{
                console.log(foundComment.author.id);
                console.log(req.user.id);
                if(foundComment.author.id.equals(req.user.id)){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });   
    } else{
        req.flash("error","You need to login first.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }   
    
    req.flash("error", "Please Login First!!");
    res.redirect("/login");
};

module.exports = middlewareObj;