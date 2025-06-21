const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isAuthor } = require("../middleware.js");

const reviewController = require("../controllers/review.js");

//add the review in db
router.post("/", isLoggedIn, reviewController.addreview);

//delete request for reviews
router.delete(
  "/:reviewId",
  isAuthor,
  wrapAsync(reviewController.destoryReview)
);

module.exports = router;
