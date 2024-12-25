const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js")

router.route("/signup")
.get(userController.renderSignUpform)
.post(wrapAsync(userController.signUp));

router.route("/login")
.get(userController.renderloginform)
.post(
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true
    }),
    userController.login);

router.get("/logout",userController.logOut)


// router.get("/signup",userController.renderSignUpform)

// router.post("/signup",wrapAsync(userController.signUp))

// router.get("/login",userController.renderloginform)

// router.post(
//     "/login",
//     saveRedirectUrl,
//     passport.authenticate("local",{
//         failureRedirect:"/login",
//         failureFlash:true
//     }),
//     userController.login)

// router.get("/logout",userController.logOut)

module.exports =  router;