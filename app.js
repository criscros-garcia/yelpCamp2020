let express = require('express');
let app = express();
let methodOverride = require('method-override');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let passport = require('passport');
let localStrategy = require('passport-local');
let User = require('./models/user');
let Campground = require('./models/campground');
let Comment = require('./models/comment');
let seedDB = require('./seed');

let campgroundRoutes = require('./routes/campgrounds');
let commentRoutes    = require('./routes/comments');

mongoose.connect("mongodb://localhost/yelpCamp",  {useNewUrlParser: true , useUnifiedTopology: true });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use('/css', express.static(__dirname + "/css"));
seedDB();
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
  next();
});

app.use(campgroundRoutes);
app.use(commentRoutes);

app.get("/", function(req, res){
  res.render("landing");
});





// Auth Routes

app.get('/register', function(req, res){
  res.render('register');
});

app.post('/register', function(req, res){
  let newUser = new User({username: req.body.username});
  let password = req.body.password;
  User.register(newUser, password, function(err, userCreated){
    if(err){ console.log(err); return res.render('register');}
    else{
      passport.authenticate('local')(req, res, function(err){
        if(err){
          // console.log(err);
          console.log('I cannot Authenticate, sorry');
          return res.redirect('/register');
        }else{
          console.log('Authentication succesfull¡');
          res.redirect('/campgrounds');
        }
      });
    }
  });    
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', passport.authenticate('local', 
{
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}), function(req, res){

});

app.get('/logout', function(req, res){
  req.logOut();
  res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}


app.listen(process.env.PORT || 3000, process.env.IP, function(){
  console.log("YelpCamp server has started!");
});  