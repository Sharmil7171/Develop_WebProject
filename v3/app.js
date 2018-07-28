var express         = require("express");
var mongoose        = require("mongoose");
var flash           = require("connect-flash");
var passport        = require("passport");
var LocalStrategy   = require("passport-local");
var bodyParser      = require("body-parser");
var Campground      = require("./models/campground");
var Comment         = require("./models/comment");
var User            = require("./models/user");
var seedDB          = require("./seeds");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

//Requiring Routes
var router = express.Router();
var campgroundsRoutes = require("./routes/campgrounds");
var commentRoutes     = require("./routes/comments");
var indexRoutes       = require("./routes/index");




var app = express();

//seedDB(); //Seeds the database
mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret : "I am the king of the world...",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to provide user info if login or blank user to every route
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundsRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCanp server is started!");
});