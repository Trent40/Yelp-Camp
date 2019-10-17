// Middleware 
var Campground    = require("../models/campground");
var Comment       = require("../models/comment");
var middlewareObj = {};

// Middleware checkCampgroundOwnership

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err || !foundCampground){
				req.flash("error", "Unauthorized");
				res.redirect("back");
			} else {
			if(foundCampground.author.id.equals(req.user._id)) {
				next();
			} else {
				req.flash("error", "Unauthorized");
				res.redirect("back");
					}	
			}
		});	
	} else {
		res.redirect("back");
		req.flash("error", "Please Login");
	}
}

// Middleware checkCommentOwnership

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				req.flash("error", "Comment Not Found")
				res.redirect("back");
			} else {
			if(foundComment.author.id.equals(req.user._id)) {
				next();
			} else {
				req.flash("error", "Unauthorized");
				res.redirect("back");
			}	
			}
		});	
	} else {
		req.flash("error", "Please Login");
		res.redirect("back");
	}
}

// Middleware isLoggedIn

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login");
	res.redirect("/login");
}

module.exports = middlewareObj