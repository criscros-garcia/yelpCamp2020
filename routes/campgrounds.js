let express    = require('express');
let router     = express.Router({mergeParams: true});
let Campground = require('../models/campground');
const campground = require('../models/campground');


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

router.get('/new', isLoggedIn, function(req, res){
  res.render('new');
});

router.post('/', isLoggedIn ,function(req, res){

  let newCampground = req.body.campground;
  let author = {
    id:       req.user._id,
    username: req.user.username
  }
  newCampground.author = author;

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

router.get('/:id/edit', checkCampgroundOwnership ,function(req, res){
  Campground.findById(req.params.id, function(err, foundToUpdate){
    if(err){
      console.log('Could not be found to update¡'+ err);
    }else{
      res.render('edit', {campground: foundToUpdate});
    }
  });
});

router.put('/:id', checkCampgroundOwnership ,function(req, res){
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

router.delete('/:id', checkCampgroundOwnership ,function(req, res){
  Campground.findByIdAndDelete(req.params.id, function(err){
    if(err){
      console.log("Error triying to eliminate¡");
      res.redirect("/campgrounds/"+req.params.id);
    }else{
      res.redirect('/campgrounds');
    }
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCamp){
      if(err){
        console.log(err);
        res.redirect("back");
      }else{
        if(foundCamp.author.id.equals(req.user._id)){
          next();
        }else{
          console.log("The post does not belong to you¡");
          res.redirect("/campgrounds/"+req.params.id);
        }
      }
    })
  }else{
    console.log("Please Log in First¡");
    res.redirect("/login");
  }
}



module.exports = router;
