let express = require('express');
let app = express();
let methodOverride = require('method-override');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let passport = require('passport');
let localStrategy = require('passport-local');
let User = require('./models/user');
let seedDB = require('./seed');
let flash = require('connect-flash');

let campgroundRoutes = require('./routes/campgrounds');
let commentRoutes    = require('./routes/comments');
let indexRoutes      = require('./routes/index');

mongoose.connect("mongodb://localhost/yelpCamp",  {useNewUrlParser: true , useUnifiedTopology: true });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use('/public/stylesheets', express.static(__dirname + "/public/stylesheets"));
app.use(flash());
// seedDB();

// PASSPORT CONFIG
app.use(require('express-session')({
  secret: "The Node Power¡",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error       = req.flash("error");
  res.locals.success     = req.flash("success");
  next();
});



app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
  console.log("YelpCamp server has started!");
});  