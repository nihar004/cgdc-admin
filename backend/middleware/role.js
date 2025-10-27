// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.session.userRole !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

module.exports = {
  isAdmin,
};
