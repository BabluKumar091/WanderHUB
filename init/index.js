const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(async () => {
    console.log("connected to DB");
    await initDB();
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
  });


async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  const owner = await User.findOne({});
  if (!owner) {
    console.error("No user found! Please seed users first.");
    return;
  }

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: owner._id,
  }));

  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};
