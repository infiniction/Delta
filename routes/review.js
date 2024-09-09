 const express = require("express");
const router = express.Router({mergeParams: true});//jo iske andr likha hai vo review ki id ko yha tak lata hai nhi to app.js tak aa pati  hai 
const wrapAsync= require("../utils/wrapasync.js"); //to handle error
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,  reviewSchema }=require("../schema.js");//use to validate the nboth schema listings and reviews
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn , isReviewAuthor} = require("../middleware.js");


const reviewController = require("../controllers/reviews.js");





//create review
 router.post("/",
 isLoggedIn,
 validateReview, 
 wrapAsync (reviewController.createReview));
    
   
   //delete review
   router.delete(
      "/:reviewId",//common part cut kr do
      isLoggedIn,//check frist user loggedin or not
      isReviewAuthor,
       wrapAsync(reviewController.destroyReview));
    
    module.exports = router;