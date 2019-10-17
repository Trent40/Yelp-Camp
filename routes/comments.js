var express    = require("express");
var	router     = express.Router({mergeParams: true});
var	Campground = require("../models/campground");
var	Comment    = require("../models/comment");
var middleware = require("../middleware");

//============================================================
//                Comments Routes
//============================================================

// Comments New

router.get("/new", middleware.isLoggedIn, function(req, res){
    // Find campground by id
	console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

// Comments Create

router.post("/", middleware.isLoggedIn, function(req, res){
   
	//Lookup Campground using ID
	
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           //new added code
           let author = { 
               id: req.user._id,
               username: req.user.username
           }
           req.body.comment.author = author
        Comment.create(req.body.comment, function(err, comment){
           if(err){
			   req.flash("error", "Error");
               console.log(err);
           } else {
			   comment.author.id = req.user._id,
			   comment.author.username = req.user.username;
			   comment.save();
				console.log(comment);
               campground.comments.push(comment);
               campground.save();
			   req.flash("success", "Successfully Added");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
  
});

// Comment Edit Route

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err || !foundCampground) {
			req.flash("error", "No Campground Found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			} else {
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			}
		});
	});
	
});

//Comment Update

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id );
		}
	});
});

// Comment Destroy Route

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment Deleted")
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;