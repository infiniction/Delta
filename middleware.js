   const Listing = require("./models/listing.js");
   const ExpressError=require("./utils/ExpressError.js");
   const {listingSchema, reviewSchema }=require("./schema.js");//requiring review and listing schema
   const Review = require("./models/review.js");


 //jab bhii server restart hota hai log in h jata hai
  module.exports.isLoggedIn =  (req, res, next)=>{
    // console.log(req.user);//agr yeh undifine aaya to user login nhi hai ar agr kuh value print hui to user login hai hm isi ka use krege navbar me ki agr agr login hai to sirf logout dikhana hai app.js me likho 
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;//it will save the url jha abb redirect krna hai
        req.flash("error", "you must be logged in to ceate listing!");
       return res.redirect("/login");
    }
    next();
}
 

//kyuki jaise hi passport- local chlta hai hai session ko empty kr deta to req.session.redirectUrl iski value undefined ho jati hai 
module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl ){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
//to prevent editing by some hoobsscotch req
 module.exports.isOwner = async(req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of listing");
        return res.redirect(`/listings/${id}`);
    }
    next();//very imp to write otherwise it will stuck here
};

// to validate listing 
module.exports.validateListing=((req, res, next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
     }else{
        next();
     }
})

//to validate review
module.exports.validateReview=((req, res, next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
     }else{
        next();
     }
})
//its ensure that only vo hi review dlete krega jisne create kiya hai
module.exports.isReviewAuthor = async (req, res, next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of listing");
        return res.redirect(`/listings/${id}`);
    }
    next();//very imp to write otherwise it will stuck here
};
