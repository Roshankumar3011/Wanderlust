const Listing = require("../models/listing");
const Review = require("../models/review");
const { reviewSchema } = require("../schema"); // Add this line to include validation

// Middleware-style validation (embedded directly for your style)
function validateReviewData(data) {
    const { error } = reviewSchema.validate(data);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        const err = new Error(msg);
        err.statusCode = 400;
        throw err;
    }
}

module.exports.createReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();
        req.flash("success", "New Review Created!");
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        req.flash("error", err.message || "Something went wrong!");
        res.redirect("/listings");
    }
};

module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);
};
