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

app.get("/", function(req, res){
  res.render("landing");
});



// COMMENTS ROUTES

app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log('Error finding id to make a comment¡');
    }else{
      res.render('comments/new', { campground:campground });
    }
  });
});

app.post('/campgrounds/:id/comments/', isLoggedIn, function(req, res){
  let newComment = req.body.comment;
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log('Error finding a campground to make a new comment¡');
      res.redirect('/campgrounds/'+req.params.id);
    }else{
      Comment.create(newComment, function(err, commentCreated){
        if(err){
          console.log('Error creating new comment');
        }else{
          console.log('No fear to success¡');
          campground.comments.push(commentCreated);
          campground.save();
          res.redirect('/campgrounds/'+req.params.id);
        }
      });
    }
  });
});

app.get('/campgrounds/:id/comments/:comment_id/edit', function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log('Error finding id to make a comment¡');
    }else{
      Comment.findById(req.params.comment_id, function(err, commentFound){
        if(err){
          console.log('Error finding that comment id');
        }else{
          console.log('No fear to succes¡');
          res.render('comments/edit',{campground: campground, comment:commentFound});
        }
      });
    }
  });
});

app.put('/campgrounds/:id/comments/:comment_id', function(req, res){
  Campground.findById(req.params.id, function(err, campFounded){
    if(err){
      console.log('Error finding campground for updating a comment¡');
    }else{
      Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, commentUpdated){
        if(err){
          console.log('Error updating the comment');
          res.redirect('/campgrounds/'+req.params.id);
        }else{
          res.redirect('/campgrounds/'+req.params.id);
        }
      });
    }
  });
});

app.delete('/campgrounds/:id/comments/:comment_id', function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log('Error finding a campground.')
    }else{
      Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err){
          console.log('Error eliminating a comment¡');
          res.redirect('/campgrounds/'+req.params.id);
        }else{
          console.log('Comment deleted Succesfully¡');
          res.redirect('/campgrounds/'+req.params.id);
        }
      });
    }
  });
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