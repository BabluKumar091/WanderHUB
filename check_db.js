const mongoose = require("mongoose");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");

async function checkDB() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    const users = await User.find({});
    const listings = await Listing.find({}).limit(1);
    console.log("USERS_COUNT:", users.length);
    if (users.length > 0) {
        console.log("FIRST_USER_ID:", users[0]._id);
    }
    console.log("LISTINGS_COUNT:", await Listing.countDocuments());
    if (listings.length > 0) {
        console.log("FIRST_LISTING_OWNER:", listings[0].owner);
    }
    await mongoose.connection.close();
}

checkDB().catch(console.error);
