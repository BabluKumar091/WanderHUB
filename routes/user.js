const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req,res) => {
    if (req.isAuthenticated()) {
        req.flash('error', 'You are already logged in!');
        return res.redirect('/listing');
    }
    res.render("user/signup.ejs");
})

router.post('/signup', async(req, res) => {
    try {
        let {username, email, password} = req.body;
    let newUser = new User({username, email});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success', 'Welcome to Wanderlust !');
        res.redirect('/listing');
    });
    console.log(registeredUser);
        
    } catch (error) {
        console.log(error);
        res.redirect('/signup');
    }
    
})

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        req.flash('error', 'You are already logged in!');
        return res.redirect('/listing');
    }
    res.render("user/login.ejs");
});

router.post(
    '/login',
    saveRedirectUrl,
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    (req, res) => {
        req.flash('success', 'Welcome back to Wanderlust!');
        res.redirect(res.locals.redirectUrl);
    }
);


router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', "Logged you out !");
        res.redirect('/listing');
    })
})

module.exports = router;