let Campground = require('../models/campground');
let Comment = require('../models/comment');

let middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error","Please Login First¡");
  res.redirect('/login');
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCamp){
      if(err){
        req.flash("error", err.message);
        res.redirect("back");
      }else{
        if(foundCamp.author.id.equals(req.user._id)){
          next();
        }else{
          req.flash("error", "The post does not belong to you¡");
          res.redirect("/campgrounds/"+req.params.id);
        }
      }
    })
  }else{
    console.log("Please Log in First¡");
    res.redirect("/login");
  }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        req.flash("error", err.message);
        res.redirect("back");
      }else{
        if(foundComment.author.id.equals(req.user._id)){
          next();
        }else{
          req.flash("error", "You can only edit/delete your comments¡");
          res.redirect("/campgrounds/"+req.params.id);
        }
      }
    });
  }else{
    console.log("Please, log in first¡");
    res.redirect('/login');
  }
}

module.exports = middlewareObj;