module.exports = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    req.flash("error", "Please log in first.");
    return res.redirect("/users/login");
  }

  if (req.user.role !== "delivery") {
    req.flash("error", "Access denied. Delivery partners only.");
    return res.redirect("/product");
  }

  next();
};