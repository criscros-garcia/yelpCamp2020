let express    = require('express');
let router     = express.Router({mergeParams: true});
let Campground = require('../models/campground');
let middleware = require('../middleware');
let flash = require('connect-flash');

router.get("/", function(req, res){
  Campground.find({}, function(err, campgrounds){
    if(err){
      console.log(err);
      console.log("Something went wrong");
    }else{
      res.render('index', {campgrounds:campgrounds});
    }
  });
  
});

router.get('/new', middleware.isLoggedIn, function(req, res){
  res.render('new');
});

router.post('/', middleware.isLoggedIn ,function(req, res){

  let newCampground = req.body.campground;
  let author = {
    id:       req.user._id,
    username: req.user.username
  }
  newCampground.author = author;

  Campground.create(newCampground, function(err, newCreated){
    if(err){
      req.flash("error", "Campground could not be created¡");
    }else{
      console.log("Campground created succesfully¡");
      req.flash("success", "Campground created succesfully!");
      res.redirect('/campgrounds');
    }
  });
});

router.get('/:id', function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
    if(err){
      console.log("Can't be found");
    }else{
      res.render('show', {campground:foundCamp});
    }
  });
});

router.get('/:id/edit', middleware.checkCampgroundOwnership ,function(req, res){
  Campground.findById(req.params.id, function(err, foundToUpdate){
    if(err){
      console.log('Could not be found to update¡'+ err);
    }else{
      res.render('edit', {campground: foundToUpdate});
    }
  });
});

router.put('/:id', middleware.checkCampgroundOwnership ,function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updated){
    if(err){
      console.log("Error triying to Update");
      req.flash("error", "Error triying to Update¡");
      res.redirect('index');
    }else{
      console.log("Succesfull update¡");
      req.flash("success", "Campground updated succesfully¡");
      res.redirect('/campgrounds/'+req.params.id);
    }
  });
});

router.delete('/:id', middleware.checkCampgroundOwnership ,function(req, res){
  Campground.findByIdAndDelete(req.params.id, function(err){
    if(err){
      console.log("Error triying to eliminate¡");
      res.redirect("/campgrounds/"+req.params.id);
    }else{
      req.flash("success", "Campground deleted succesfully¡");
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
