var express = require("express");
var passport= require("passport");

var router = express.Router();
var User = require("../models/user");


router.get("/", function(req,res) {
    res.render("landing");
});

//==========================
//AUTH ROUTE
//==========================

//Show Register form
router.get("/register",function(req, res) {
   res.render("register"); 
});


//handle sign up logic
router.post("/register",function(req, res) {
   var newUser = new User({username : req.body.username});
   
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message);
           return res.render("register");
       }else{
           passport.authenticate("local")(req,res,function(){
               req.flash("success", "Welcome to YelpCamp "+ user.username);
              res.redirect("/campgrounds"); 
           });
       }
   });
});


//Login page
router.get("/login",function(req, res) {
   res.render("login");
});

//Handling Login logic
router.post("/login", passport.authenticate("local",{
    successRedirect : "/campgrounds",
    failureRedirect : "/login"
}),function(req,res){
});

//Logout Route
router.get("/logout",function(req, res) {
   req.logout();
   
   req.flash("success", "Logged you out!!")
   res.redirect("/campgrounds");
});

module.exports = router;