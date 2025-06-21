const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const listingController = require("../controllers/listing.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/", listingController.index);

//create New listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

//showing all data of particular property

router.get("/:id", listingController.showlistingdata);

//now after taking input from form we add that new listing in database and redirect
router.post(
  "/",
  isLoggedIn,
  upload.single("image"),
  wrapAsync(listingController.createListing)
);

// router.post("/", upload.single("image"), (req, res) => {
//   res.send(req.file);
// });

//edit the data ,first we give get request to render form and then put request to do actual change in db
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);

//update in db finally
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("image"),
  listingController.updateListing
);

//delete the listing
router.delete("/:id", isLoggedIn, isOwner, listingController.destoryListing);

module.exports = router;
