const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// Root route
router.get("/", function(req, res){
    res.render("landing");
});

// Show register form
router.get("/register", function(req, res){
    res.render("register");
});

// Handle register logic
router.post("/register", function(req, res){
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Yelp Camp " + user.username);
            res.redirect("/campgrounds");
        })
    });
});

// Show login form
router.get("/login", function(req, res){
    res.render("login");
});

// Show admin form
router.get("/admin", function(req, res){
    res.render("admin");
});

// Handle admin logic
router.post("/admin", function(req, res){
    if(req.body.admin.password === "makisePudding"){
        User.findById(req.user._id, function(err, foundUser){
            foundUser.isAdmin = true;
            foundUser.save();
        });
    }
    res.redirect("/campgrounds");
});

// Handle login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// Logout Route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;
