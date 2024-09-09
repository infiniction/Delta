const express = require("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapasync.js"); //to handle error
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema, reviewSchema }=require("../schema.js");//use to validate the nboth schema listings and reviews
const Listing = require("../models/listing.js");//yeh galat kiya tha tumne 
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const multer  = require('multer')//to handle multi form data image upload ke liye
const {storage} = require("../cloudConfig.js");// jha images dtore hogi isko upload se upr rakhna hai
const upload = multer({ storage });



const listingController = require("../controllers/listings.js");


//here we will combine the same path request by router.route
 router.route("/")
.get( wrapAsync (listingController.index))//index route 
.post(  //create route
  isLoggedIn ,
 
  upload.single('listing[image]'),//to upload image
  validateListing, 
  wrapAsync(listingController.createListing ));

//new route isko upr rakhna pdega nhi to vo id man lega
router.get("/new", isLoggedIn,(listingController.renderNewForm));
  

router.route("/:id")
.get(  wrapAsync(listingController.showListing))//show route
.put(                    //update route
        isLoggedIn, 
        isOwner,
        upload.single('listing[image]'),
        validateListing, 
         wrapAsync (listingController.updateListing)
)
.delete(
      isLoggedIn,
      isOwner,
      wrapAsync (listingController.destroyListing)
)


      //edit route
      router.get("/:id/edit", 
      isLoggedIn, 
      isOwner, 
      wrapAsync (listingController.renderEditForm));
       
      
      


       module.exports= router;