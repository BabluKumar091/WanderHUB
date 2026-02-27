const Listing = require("./models/listing");
const Review = require("./models/reviews");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schemas.js");

Listing;
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    const msg = req.originalUrl.includes('/reviews')
      ? 'Please login first to leave a review'
      : 'You must be logged in to access that page';
    req.flash('error', msg);
    return res.redirect('/login');
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  res.locals.redirectUrl = req.session.redirectUrl || "/listing"; // default
  delete req.session.redirectUrl; // clean up once used
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing.owner._id.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review || !review.author.equals(req.user._id)) {
    req.flash('error', 'You can only modify your own reviews!');
    return res.redirect(`/listing/${req.params.id}`);
  }
  next();
};
