const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');//require geocoding library
const mapToken = process.env.MAP_TOKEN;//reqie map token
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); //using github

//index route
module.exports.index = async(req,res)=>{
    const allLsitings= await Listing.find({});
    console.log(allLsitings);
  res.render("listings/index.ejs",  { allLsitings });//agr kisi folder ke andr ho ejs file ho to iss trh likhte hai
  };


  //new route
  module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
    };

 //show route
    module.exports.showListing= async(req, res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id)
      .populate({
          path: "reviews", //ab review ke andr author bhi hai
       populate:{
          path:"author",  //nested populate
        },
      })
      .populate("owner");  //.populate method se uss listiing me jo bhi reveiw comment sabki poori details aa jaygei
        if(!listing){ 
          req.flash("error", " Listing Not Exist");//agr koyi aise listing me jaye jo delete kr di ho to yeh message aayega
          res.redirect("/listings");
        }
        res.render("listings/show.ejs", {listing});
        };
 

        //create route

          module.exports.createListing = (async (req,res, next)=>{

          let response = await geocodingClient
          .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
          })
            .send();

          let url = req.file.path; //getting imge url
          let filename = req.file.filename;
          const newListing=new Listing(req.body.listing);
          newListing.owner = req.user._id;//yha pe ab hr listing ke sath user id bhi save hogi
          newListing.image ={url, filename};
          newListing.geometry = response.body.features[0].geometry;
          let savedListing =  await newListing.save();
            console.log(savedListing);
            req.flash("success", "New Listing Created!");
            res.redirect("/listings");
            });


       //edit route
       module.exports.renderEditForm=async(req, res)=>{
        let {id}=req.params;
      const listing=await Listing.findById(id);
       if(!listing){ 
       req.flash("error", " Listing Not Exist");//agr koyi aise listing me jaye jo delete kr di ho to yeh message aayega
       res.redirect("/listings");
   }
      let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/,w_250")//yhe image ka url chane kr dega to decrese the size whatever the property it have 
       res.render("listings/edit.ejs",{listing, originalImageUrl});
    };

    //update route
    module.exports.updateListing=async(req, res)=>{

        let {id}=req.params;
       let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
        
     if(typeof req.file !== "undefined"){  //jb image file choose kri ho
      let url = req.file.path; //getting imge url
      let filename = req.file.filename;
      listing.image = {url, filename}; //set the new image in listings
      await listing.save();
     }

       req.flash("success", " Listing updated!");
       res.redirect(`/listings/${id}`);
    };
    
    //delete route
    module.exports.destroyListing = async(req, res)=>{
        let {id}=req.params;
     let deletdListing= await Listing.findByIdAndDelete(id);
    console.log(deletdListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
    };