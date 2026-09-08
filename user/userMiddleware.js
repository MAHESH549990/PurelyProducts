module.exports.isLoggedIn=(req,res,next)=>{
   if(!req.isAuthenticated()){
    req.flash("error","You must be logged in before place and add to cart the product");
    return res.redirect("/users/login");
  }
  next();
}

module.exports.isSignup=(req,res,next)=>{
  req.login(registeredUser,)
}