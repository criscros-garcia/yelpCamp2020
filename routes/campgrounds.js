let express    = require('express');
let router     = express.Router();
let Campground = require('../models/campground');


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

router.get('/new', function(req, res){
  res.render('new');
});

router.post('/', function(req, res){

  let newCampground = req.body.campground;

  Campground.create(newCampground, function(err, newCreated){
    if(err){
      console.log('Error creating a Campground¡');
      console.log(err);
    }else{
      console.log("Campground created succesfully¡");
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

router.get('/:id/edit', function(req, res){
  Campground.findById(req.params.id, function(err, foundToUpdate){
    if(err){
      console.log('Could not be found to update¡'+ err);
    }else{
      res.render('edit', {campground: foundToUpdate})
    }
  });
});

router.put('/:id', function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updated){
    if(err){
      console.log("Error triying to Update");
      res.redirect('index');
    }else{
      console.log("Succesfull update¡");
      res.redirect('/campgrounds/'+req.params.id);
    }
  });
});

router.delete('/:id', function(req, res){
  Campground.findByIdAndDelete(req.params.id, function(err){
    if(err){
      console.log("Error triying to eliminate¡");
      res.redirect("/campgrounds/"+req.params.id);
    }else{
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
