const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./modles/listing.js")
const PORT = 8080;
const path = require("path");
const methodOverride = require('method-override');
const engine = require('ejs-mate');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride('_method'));
app.engine('ejs', engine);

main().then(res => console.log("Database connnection done")
).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

app.get("/", (req,res)=> {
    res.send("working...")
})

// index route
app.get("/listing", async(req, res) => { 
  const allListing = await Listing.find({});
  res.render("listing/index", { allListing });
})

//edit
app.get('/listing/:id/edit', async(req,res) => {
  const {id} = req.params;
  const listing = await Listing.findById(id);
  res.render('listing/edit.ejs', {listing});
})

//new route
app.get('/listing/new', (req, res) => {
  res.render("listing/new.ejs");
})

// show route
app.get('/listing/:id', async(req, res) => {
  const {id} = req.params;
  const listing = await Listing.findById(id);
  res.render('listing/show.ejs', {listing});
})

// new route add
app.post('/listing', async(req, res) => {
  let newListing = new Listing(req.body.listing);
  newListing.save()
  res.redirect("/listing")

})

//update route
app.put('/listing/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, country, image } = req.body.listing;

  const updatedListing = await Listing.findById(id);
  
  updatedListing.title = title;
  updatedListing.description = description;
  updatedListing.price = price;
  updatedListing.location = location;
  updatedListing.country = country;

  updatedListing.image = {
    url: image, 
    filename: "listingimage"
  };

  await updatedListing.save();
  
  res.redirect('/listing');
});


//Delete route
app.delete('/listing/:id', async(req,res) => {
  const {id}= req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listing');
})


app.listen(PORT, ()=> {
    console.log(`App is listinning on port ${PORT}`);
})