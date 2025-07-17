const Listing = require("../models/listing");

// List all listings or filter by category or search query
module.exports.index = async (req, res) => {
  const { category, q } = req.query;

  let filter = {};
  if (category) filter.category = category;
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
    ];
  }

  const listings = await Listing.find(filter);
  res.render("listings/index", {
    listings,
    selectedCategory: category || "",
    searchQuery: q || "",
  });
};

// Render form to create new listing
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Show a single listing
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// Create a new listing
module.exports.createListing = async (req, res) => {
  let url = req.file?.path || "https://images.unsplash.com/photo-1602088113235-229c19758e9f?auto=format&fit=crop&w=800&q=60";
  let filename = req.file?.filename || "default";

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

// Render edit form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  const originalImageUrl = listing.image.url.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// Update a listing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  const data = req.body.listing || {};

  // Handle file upload
  if (req.file) {
    listing.image = { url: req.file.path, filename: req.file.filename };
  }

  // Preserve existing image if no new one
  if (!data.image || !data.image.url || data.image.url.trim() === "") {
    data.image = listing.image;
  }

  Object.assign(listing, data);
  await listing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// Delete a listing
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
