const mongoose = require("mongoose");
const Review = require("./reviews.js");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: { type: String, default: "default_image" },
    url: {
      type: String,
      default:
        "https://miro.medium.com/v2/resize:fit:720/format:webp/0*qlUYnDrTVDAYZfqE",
      set: (v) =>
        v === ""
          ? "https://miro.medium.com/v2/resize:fit:720/format:webp/0*qlUYnDrTVDAYZfqE"
          : v,
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: {
        $in: listing.reviews,
      },
    });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
