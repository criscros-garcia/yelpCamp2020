let express    = require('express');
let router     = express.Router();
let Campground = require('../models/campground');
let Comment    = require('../models/comment');
// COMMENTS ROUTES

router.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log('Error finding id to make a comment¡');
    }else{
      res.render('comments/new', { campground:campground });
    }
  });
});

router.post('/campgrounds/:id/comments/', isLoggedIn, function(req, res){
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

router.get('/campgrounds/:id/comments/:comment_id/edit', function(req, res){
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

router.put('/campgrounds/:id/comments/:comment_id', function(req, res){
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

router.delete('/campgrounds/:id/comments/:comment_id', function(req, res){
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

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;