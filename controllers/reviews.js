 const Listing =require("../models/listing.js");
 const Review = require("../models/review.js");
 


 //create review
 module.exports.createReview=(async (req, res)=>{//wrapasync err handling ke liye hai bs
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review (req.body.review);//jo req.body me review aaya hai vo newReview me le liya hai
    newReview.author= req.user._id; //ab review ke sath author bhi save hoga
    //console.log(newReview);
    listing.reviews.push(newReview);//review ko reviews nam ke array me push kr diya jo review ke schema bnaya tha
    await newReview.save();
    await listing.save();
    console.log("new review saved");
    req.flash("success", "New Review Created!");
     res.redirect(`/listings/${listing._id}`);
    });

    //delete review
module.exports.destroyReview=async(req, res) => {
    let {id, reviewId} = req.params;
  
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId}});//means listing me bhut sare review the to hmne usme se jisse  hmari reviewId match hui us review ko pull oprator se pull kr diya
    await Review.findByIdAndDelete(reviewId);//reviews collections se review delete ho gya
    req.flash("success", "Review Deleted!");
   res.redirect(`/listings/${id}`);
  };
  