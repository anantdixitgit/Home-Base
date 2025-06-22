const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  //console.log("yes");
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  console.log("yes");
  res.render("listings/newlisting.ejs");
};

module.exports.showlistingdata = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing doesnot exist");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  // Check for uploaded file
  if (!req.file) {
    console.log("❌ File not uploaded");
    req.flash("error", "Please upload an image.");
    return res.redirect("/listings/new");
  }

  const { title, description, price, location, country } = req.body;

  const listing = new Listing({
    title,
    description,
    price,
    location,
    country,
    image: {
      url: req.file.path,
      filename: req.file.filename,
    },
    owner: req.user._id,
  });

  await listing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing doesnot exist");
    res.redirect("/listings");
  }
  res.render("listings/edit_listing.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  // console.log("put request recieve");
  // res.send("working");
  let { id } = req.params;
  let { title, description, image, price, location, country } = req.body;

  let listing = await Listing.findByIdAndUpdate(id, {
    title,
    description,
    image,
    price,
    location,
    country,
  });
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destoryListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
