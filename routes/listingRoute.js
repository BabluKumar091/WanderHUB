const express = require('express');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing} = require('../middleware.js');

const router = express.Router();

// INDEX ROUTE
router.get("/", async (req, res) => {
  const allListing = await Listing.find({}).populate('owner');
  res.render("listing/index", { allListing });
})


// NEW ROUTE (SHOW FORM)
router.get('/new', isLoggedIn, (req, res) => {
  res.render("listing/new.ejs");
})


// CREATE ROUTE (POST)
router.post('/', isLoggedIn, validateListing, async (req, res, next) => {
  try {
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user && req.user._id ? req.user._id : null;
    await newListing.save();

    req.flash("success", "Listing added successfully!");
    res.redirect("/listing");

  } catch (err) {
    req.flash("error", "Failed to add listing!");
    next(err);
  }
});


// SHOW ROUTE
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({ path: 'reviews', populate: 'author' })
    .populate('owner');
  res.render('listing/show.ejs', { listing });
});

// Redirect to login with flash when guest clicks review button
router.get('/:id/reviews/redirect', (req, res) => {
  const { id } = req.params;
  // remember where to return after login
  req.session.redirectUrl = `/listing/${id}`;
  req.flash('error', 'Please login first to leave a review');
  res.redirect('/login');
});



// EDIT ROUTE (SHOW FORM)
router.get('/:id/edit', isLoggedIn,isOwner, async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate('owner');
  res.render('listing/edit.ejs', { listing });
})


// UPDATE ROUTE
router.put('/:id', isLoggedIn, isOwner, validateListing, async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, country, image } = req.body.listing;

  const updatedListing = await Listing.findById(id);

  updatedListing.title = title;
  updatedListing.description = description;
  updatedListing.price = price;
  updatedListing.location = location;
  updatedListing.country = country;
  updatedListing.image = image;

  await updatedListing.save();

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listing/${id}`);
});
// DELETE ROUTE
router.delete('/:id', isLoggedIn,isOwner, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      req.flash("error", "Listing not found!");
      return next(new ExpressError(404, "Listing not found"));
    }

    req.flash("success", "Listing deleted successfully!");
    res.redirect('/listing');

  } catch (err) {
    req.flash("error", "Failed to delete listing!");
    next(err);
  }
});

module.exports = router;
