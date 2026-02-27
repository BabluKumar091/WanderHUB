const express = require('express');
const Listing = require('../models/listing');
const Review = require('../models/reviews');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');

// mergeParams:true so we can access :id from parent path
const router = express.Router({ mergeParams: true });

// CREATE REVIEW
router.post('/', isLoggedIn, validateReview, async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listing');
    }
    const review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash('success', 'Review added successfully!');
    res.redirect(`/listing/${id}`);
  } catch (e) {
    next(e);
  }
});

// DELETE REVIEW
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/listing/${id}`);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
