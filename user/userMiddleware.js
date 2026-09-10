const {reviewScheam}=require("../schema.js");
module.exports.isLoggedIn=(req,res,next)=>{
   if(!req.isAuthenticated()){
    req.flash("error","You need to be logged in to perform this action");
    return res.redirect("/users/login");
  }
  next();
}

module.exports.validateReviews=(req,res,next)=>{
    let {error}=reviewScheam.validate(req.body);
    if(error){
      let errMsg=error.details.map((err)=>err.message).join(",");
      throw new ExpressError(400,errMsg);
    }
    next();
}
module.exports.isSignup=(req,res,next)=>{
  req.login(registeredUser,)
}