 const  User = require("../models/user.js");



//signup form
  module.exports.renderSignupForm = (req, res)=>{
    res.render("users/signup.ejs");
    };
 module.exports.signup =async (req, res)=>{
    try{
        let { username, email, password} = req.body;
        const newUser = new User({email, username});
     const registeredUser=  await  User.register(newUser, password);
     console.log(registeredUser);
     //ab jaise hi signup krege to login nhi krna pdega seedhe login bhi ho jsyyega using paasport locals
     req.login(registeredUser, (err)=>{
      if(err){
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
     })
    }
  catch(e){//try catch likhne se ab agr user phle se exist krta hua to ab ek upr message flash hoga ar page usi me rhega 
    req.flash("error", e.message);
    res.redirect("/signup");
  }
 };

 
//login form
module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login.ejs");
};

//accepting and verfying login details

module.exports.login = async(req, res)=>{
    req.flash("success", "Welocme to Wanderlust!");
     let redirectUrl = res.locals.redirectUrl || "/listings";
     res.redirect(redirectUrl);// visit lecture again 57 ka 5 yeh simple bypaas hai vaise tum jaise edit vale page ko access krne ke logoin krte fr listings vale page pr chle jate ar agr listing vale page me jake krte to
    //sabme vhi krna pdta ab jo session ke andr url save hoga seedhe  uspe redirect ho jayega bs middleware me jake lihna thoda
    };

    //logout

    module.exports.logout = (req, res, next)=>{
        req.logout((err)=>{
          if(err){
        return next(err);
          }
          req.flash("success", "you are logged out!");
          res.redirect("/listings");
        });
      };