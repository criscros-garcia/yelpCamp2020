let express    = require('express');
let router     = express.Router({mergeParams: true});
let Campground = require('../models/campground');
let Comment    = require('../models/comment');
// COMMENTS ROUTES

router.get('/new', isLoggedIn, function(req, res){
      res.render('comments/new', { campground_id:req.params.id });
  });

router.post('/', isLoggedIn, function(req, res){
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
          commentCreated.author.id        = req.user._id;
          commentCreated.author.username  = req.user.username;
          commentCreated.save();
          campground.comments.push(commentCreated);
          campground.save();
          res.redirect('/campgrounds/'+req.params.id);
        }
      });
    }
  });
});

router.get('/:comment_id/edit', checkCommentOwnership ,function(req, res){
      Comment.findById(req.params.comment_id, function(err, commentFound){
        if(err){
          console.log('Error finding that comment id');
        }else{
          console.log('No fear to succes¡');
          res.render('comments/edit',{campground_id: req.params.id, comment:commentFound});
        }
      });
    });

router.put('/:comment_id', checkCommentOwnership ,function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, commentUpdated){
      if(err){
        res.redirect('back');
      }else{
        res.redirect('/campgrounds/'+req.params.id);
      }
    });
  });

router.delete('/:comment_id', checkCommentOwnership ,function(req, res){
  Comment.findByIdAndDelete(req.params.comment_id, function(err){
    if(err){
      console.log('Error eliminating a comment¡');
      res.redirect('/campgrounds/'+req.params.id);
    }else{
      console.log('Comment deleted Succesfully¡');
      res.redirect('/campgrounds/'+req.params.id);
    }
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

function checkCommentOwnership(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        console.log("Comment not found "+err);
        res.redirect("back");
      }else{
        if(foundComment.author.id.equals(req.user._id)){
          next();
        }else{
          console.log("You can only edit/delete your comments¡ ");
          res.redirect("/campgrounds/"+req.params.id);
        }
      }
    });
  }else{
    console.log("Please, log in first¡");
    res.redirect('/login');
  }
}

module.exports = router;