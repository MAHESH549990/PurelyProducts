const renderPage=require("../utils/renderPage.js");

module.exports = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    res.status(401);
    return renderPage(req,res,"routes/error.ejs",{message:"Please sign in to access delivery tools.",status:401});
  }

  if (req.user.role !== "delivery") {
    res.status(403);
    return renderPage(req,res,"routes/error.ejs",{message:"This account is not an approved delivery partner. Sign in with a delivery account.",status:403});
  }

  next();
};
