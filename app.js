const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const PORT = 3000;
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const listingRouter = require("./routes/listingRoute.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const userRouter = require("./routes/user.js");
const { isLoggedIn } = require('./middleware.js');

// View and Static Config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", engine);

// ---------------------------
// Session MUST come first
// ---------------------------
app.use(
  session({
    secret: "mysupersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

// -------------------------------------------
// Passport MUST come BEFORE flash!
// -------------------------------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// -------------------------------------------
// Flash MUST come AFTER passport
// -------------------------------------------
app.use(flash());

// Flash + User middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Routes
app.use("/", userRouter);
app.use("/listing", listingRouter);

// Database Connection
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
  .then(() => console.log("Database connection done"))
  .catch((err) => console.log(err));

// Root Route
app.get("/", (req, res) => {
  res.redirect("/listing");
});

// Review Routes are handled in their own router
const reviewRouter = require('./routes/reviewRoutes');
app.use('/listing/:id/reviews', reviewRouter);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
