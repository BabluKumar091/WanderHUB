const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  image: {
    filename: { type: String, default: "default_image" }, 
    url: { 
      type: String, 
      default: "https://miro.medium.com/v2/resize:fit:720/format:webp/0*qlUYnDrTVDAYZfqE",
      set: (v) => v === "" ? "https://miro.medium.com/v2/resize:fit:720/format:webp/0*qlUYnDrTVDAYZfqE" : v
    }
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
