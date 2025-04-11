const mongoose = require("mongoose");
const  Listing = require('../modles/listing.js');
let initData = require('./data.js')

main().then(res => console.log("Database connnection done")
).catch(err => console.log("what a error"));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const intDB = async () => {
    await Listing.insertMany(initData.data);
    console.log("Data is saved");   
}

intDB();