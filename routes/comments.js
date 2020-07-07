const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");
const moment = require("moment");

// Comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
    //Find campground by id
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

// Comments create
router.post("/", middleware.isLoggedIn, function(req, res){
    //Look up campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //Create new comment
            req.body.comment.date = moment().format("MMMM Do, YYYY");
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //Connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //Redirect to campground show page
                    req.flash("success", "Successfully added comment!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Comments show
router.get("/:commentid", function(req, res){
    Comment.findById(req.params.commentid, function(err, comment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/show", {comment: comment, campgroundID: req.params.id});
        }
    })
});

// Comments edit
router.get("/:commentid/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found!");
            return res.redirect("back");
        }
        Comment.findById(req.params.commentid, function(err, comment){
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {campgroundID: req.params.id, comment: comment});
            }
        });
    });
});

// Comments update
router.put("/:commentid", middleware.checkCommentOwnership, function(req, res){
    req.body.comment.date = moment().format("MMMM Do, YYYY");
    Comment.findByIdAndUpdate(req.params.commentid, req.body.comment, function(err, comment){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Comments delete
router.delete("/:commentid", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.commentid, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

module.exports = router;
