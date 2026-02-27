const mongoose = require("mongoose");
const fs = require("fs");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");

async function check() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
        const userCount = await User.countDocuments();
        const listingCount = await Listing.countDocuments();
        const firstListing = await Listing.findOne({}).populate("owner");

        const report = {
            userCount,
            listingCount,
            firstListing: firstListing ? {
                title: firstListing.title,
                owner: firstListing.owner
            } : "No listings found"
        };

        fs.writeFileSync("db_report.json", JSON.stringify(report, null, 2));
        await mongoose.connection.close();
    } catch (err) {
        fs.writeFileSync("db_report.json", JSON.stringify({ error: err.message }, null, 2));
    }
}

check();
