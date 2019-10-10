var express    = require("express");
var	router     = express.Router({mergeParams: true});
var	Campground = require("../models/campground");
var	Comment    = require("../models/comment");

//============================================================
//                Comments Routes
//============================================================

// Comments New

router.get("/new", isLoggedIn, function(req, res){
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

router.post("/", isLoggedIn, function(req, res){
   
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
               console.log(err);
           } else {
			   comment.author.id = req.user._id,
			   comment.author.username = req.user.username;
			   comment.save();
				console.log(comment);
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
  
});

// Middleware

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;