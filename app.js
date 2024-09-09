  if (process.env.NODE_ENV !="production"){
      require('dotenv').config();  }


const express=require("express");
const app=express();
const mongoose = require("mongoose");

//const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";//database wanderlust kyuki ab hm real deploy kr rhe hai to yeh hta diya hai
 const dburl = process.env.ATLASDB_URL; //yeh


const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate"); 
const wrapAsync= require("./utils/wrapasync.js"); 
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema, reviewSchema }=require("./schema.js");

const Review = require("./models/review.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session =require("express-session");
const MongoStore = require('connect-mongo');//yeh

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));


//yeh
// const store =  MongoStore.create({
//   mongoUrl: dburl,
//   crypto:{
//      secret: process.env.SECRET,
//   },
//   touchAfter: 24*3600,    
// });

// store.on("error", ()=>{
//   console.log("ERROR in MONGO SESSION STORE", err);
// });


const sessionOptions={
        //store,
        secret: process.env.SECRET,
        resave: false, 
        saveUninitialized: true,
        cookie:{
            expires: Date.now() + 7*24*60*60*1000,
            maxAge:7*24*60*60*1000, 
            httpOnly: true,
        },
     }


 app.use(session(sessionOptions));
 app.use(flash());

 
 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



 
 app.use((req, res, next)=>{
    res.locals.success = req.flash("success"); 
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
 })


main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});


//make databse
async function main(){
await mongoose.connect(dburl);
}





 app.use ("/listings", listingsRouter); 
 app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


//new work
app.get("/privacy", (req, res)=>{
  res.render("listings/privacy.ejs");
  });
 
//   /listings/serchopt/:id
app.get('/listings/search', (req, res) => {
    const searchTerm = req.query.query;
    console.log(searchTerm);
});
   app.get("/:id", wrapAsync(async(req, res, next)=>{

    let {title}=req.body;
const listing= Listing.find( {category: "title"} );
//   const listing=await Listing.findById(title);
  console.log(listing);
 res.send("fef");
//  res.render("listings/index.ejs", "id");
   }));



app.all("*",(req, res, next)=>{
    next(new ExpressError(404, "Page Not Found"));
});




 app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong"}=err;
  res.status(statusCode).render("error.ejs", {message});
 
});
app.listen(8080, ()=>{
    console.log("app is listening to port 8080 ");
});

