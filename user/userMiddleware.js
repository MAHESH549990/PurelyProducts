module.exports.isLoggedIn=(req,res,next)=>{
   if(!req.isAuthenticated()){
    req.flash("error","You need to be logged in to perform this action");
    return res.redirect("/users/login");
  }
  next();
}

module.exports.isSignup=(req,res,next)=>{
  req.login(registeredUser,)
}