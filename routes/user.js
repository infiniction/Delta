const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");//neeche jaise hi tum wrapasync likhoge apne aa yeh line aa jayegi
const passport = require("passport");
const{saveRedirectUrl} = require("../middleware.js");


const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapasync(userController.signup))

router.route("/login")
.get( userController.renderLoginForm)
.post(
  saveRedirectUrl,// yha pe hm authrnticate krne se phle hi save krva rhe hai to kyuki paaasport sesion ko empty kr deta hai authnticate krte time
 passport.authenticate("local",{
  failureRedirect: "/login", 
  failureFlash: true,
 }),
  userController.login
 );


//logout
router.get("/logout", userController.logout);


module.exports = router;