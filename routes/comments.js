let express    = require('express');
let router     = express.Router({mergeParams: true});
let Campground = require('../models/campground');
let Comment    = require('../models/comment');
let middleware = require('../middleware');
// COMMENTS ROUTES

router.get('/new', middleware.isLoggedIn, function(req, res){
      res.render('comments/new', { campground_id:req.params.id });
  });

router.post('/', middleware.isLoggedIn, function(req, res){
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
          commentCreated.author.id        = req.user._id;
          commentCreated.author.username  = req.user.username;
          commentCreated.save();
          campground.comments.push(commentCreated);
          campground.save();
          req.flash("success", "New comment added¡")
          res.redirect('/campgrounds/'+req.params.id);
        }
      });
    }
  });
});

router.get('/:comment_id/edit', middleware.checkCommentOwnership ,function(req, res){
      Comment.findById(req.params.comment_id, function(err, commentFound){
        if(err){
          console.log('Error finding that comment id');
        }else{
          console.log('No fear to succes¡');
          res.render('comments/edit',{campground_id: req.params.id, comment:commentFound});
        }
      });
    });

router.put('/:comment_id', middleware.checkCommentOwnership ,function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, commentUpdated){
      if(err){
        req.flash("error", "Comment edition failed¡");
        res.redirect('back');
      }else{
        req.flash("success", "Comment was edited succesfully¡");
        res.redirect('/campgrounds/'+req.params.id);
      }
    });
  });

router.delete('/:comment_id', middleware.checkCommentOwnership ,function(req, res){
  Comment.findByIdAndDelete(req.params.comment_id, function(err){
    if(err){
      req.flash("error", "Error eliminating a comment¡");
      res.redirect('/campgrounds/'+req.params.id);
    }else{
      req.flash("success","Comment deleted Succesfully¡");
      res.redirect('/campgrounds/'+req.params.id);
    }
  });
});


module.exports = router;