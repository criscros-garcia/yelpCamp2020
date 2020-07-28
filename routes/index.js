let express = require('express');
let router = express.Router();
let User = require('../models/user');
let passport = require('passport');

router.get("/", function(req, res){
  res.render("landing");
});

// Auth Routes

router.get('/register', function(req, res){
  res.render('register');
});

router.post('/register', function(req, res){
  let newUser = new User({username: req.body.username});
  let password = req.body.password;
  User.register(newUser, password, function(err, userCreated){
    if(err){ 
      req.flash("error", err.message); 
      return res.redirect('/register');}
    else{
      passport.authenticate('local')(req, res, function(err){
        if(err){
          req.flash("error", err.message);
          return res.redirect('/register');
        }else{
          req.flash("success", "Welcome to Yelpcamp "+userCreated.username);
          res.redirect('/campgrounds');
        }
      });
    }
  });    
});

router.get('/login', function(req, res){
  res.render('login');
});

router.post('/login', passport.authenticate('local', 
{
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}), function(req, res){

});

router.get('/logout', function(req, res){
  req.logOut();
  req.flash("success", "You are logged out¡");
  res.redirect('/campgrounds');
});

module.exports = router;