const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Plesase login yourself before adding Listings");
    return res.redirect("/login");
  }
  next();
};

//saving redirectUrl value to locals

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    console.log("yes hurrey");
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "listing not found");
    return res.redirect("/listings");
  }

  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "you don't hava permission to edit");
    return res.redirect("/listings");
  }

  next();
};

module.exports.isAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);

  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "you don't hava permission to edit or delete review");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
