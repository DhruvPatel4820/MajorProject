if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
}

// console.log(process.env.CLOUD_NAME)

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
// const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync")
const ExpressError = require("./utils/ExpressError");
// const Review = require("./models/review.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { stdin } = require('process');

// const { listingSchema,reviewSchema } = require("./schema.js")
// const {reviewSchema} = require("./schema.js");



const app = express();
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dbUrl=process.env.ATLASDB_URL;


const store= MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret: process.env.SECRET,
      },
    touchAfter: 24 * 3600, 

})

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err)
})
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
}

app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error")
    res.locals.curtUser = req.user;
    console.log(res.locals.success);
    next();
})

app.get("/demouser", async(req,res) => {
    let fakeUser = new User({
        email:"student@gmail.com",
        username:"sigma-student"
    })
    let registeredUser = await User.register(fakeUser,"helloworld");
    res.send(registeredUser);
})



// const validateReviews = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     if (error) {
//         let errmsg = error.details.map((el) => el.message).join(",");//jab bhi aditional  error detail aati h tab eska use karte h9
//         throw new ExpressError(400, errmsg)
//     } else {
//         next();
//     }

// }

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(dbUrl);
}
// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// })

// app.use("/listings", listings)

// Index Route
// app.get("/listings", wrapAsync(async (req, res) => {
//     const allListing = await Listing.find({});
//     res.render("listings/Listing.ejs", { allListing });
// }))
// //New Route
// app.get("/listings/new", (req, res) => {
//     res.render("listings/new.ejs");
// })
// // show route
// app.get("/listings/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs", { listing });
// }));
// //Create Route
// app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
//     //    let result = listingSchema.validate(req.body);
//     //    console.log(result);
//     // if(result.error){
//     //     throw new ExpressError(400,result.error);
//     // }
//     // if (!req.body.listing) {
//     //     throw new ExpressError(400, "send a valid data for listing");
//     // }
//     // try{
//     const newlisting = new Listing({
//         ...req.body.listing,
//         // console.log(newlisting)
//         image: {
//             url: req.body.listing.image.url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtnvAOajH9gS4C30cRF7rD_voaTAKly2Ntaw&s",
//         },
//     });
//     // const newlisting = new Listing(req.body.listing);
//     await newlisting.save();
//     res.redirect("/listings");
//     // console.log(req.body.listing);
//     // }catch(err){
//     //     next(err);
//     // }


// }))
// // app.post("/listings",async(req,res)=>{
// //    const newlisting = new Listing({...req.body.listing,
// //     // console.log(newlisting)
// //     image:{
// //         url:req.body.listing.image.url || "default filename",
// //     },
// //    });
// //    await newlisting.save();
// //    res.redirect("/listings");
// //    console.log(req.body.listing);

// // })
// //Edit Route
// app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", { listing });
// }))
// // update Route
// app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {

//     let { id } = req.params;
//     // console.log(req.body.listing);
//     const updatedListing = await Listing.findByIdAndUpdate(
//         id,
//         {
//             ...req.body.listing,
//             image: {
//                 url: req.body.listing.image?.url || "https://images.unsplash.com/photo-1641808886171-3d300caed21a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//                 filename: req.body.listing.image?.filename || "listingimage",
//             },
//         },
//         { new: true }
//     );
//     res.redirect("/listings");
// }));
// // app.put("/listings/:id",async(req,res)=>{
// //     let {id} = req.params;
// //     // console.log(id);
// //     await Listing.findByIdAndUpdate(id,{...req.body.listing})//here we perform the deconstruction
// //     res.redirect("/listings");

// // })
// //Delete Route
// app.delete("/listings/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let DeleteItem = await Listing.findByIdAndDelete(id);
//     console.log(DeleteItem);
//     res.redirect("/listings");
// }))

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter)
// Reviews
// post Review route
// app.post("/listings/:id/reviews",validateReviews,wrapAsync(async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();
//     res.redirect(`/listings/${listing._id}`);
//     // console.log("new review saved");
//     // res.send("new review saved ");

// }));

// // Delete Review route
// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req,res)=>{
//     let {id,reviewId} = req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
// }))

// app.get("/testListing",async(req,res)=>{
//      const sampleListing = new Listing({
//         title:"My new Villa",
//         description:"By the Beach",
//         price:1200,
//         location:"Calangute, Goa",

app.get("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"))
})
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    // res.render("error.ejs",{err});

    // res.status(statusCode).send(message);
    res.render("error.ejs", { message });
    // res.send(err.message)
    // res.send("Something went Wrong");
})
app.listen(8080, () => {
    console.log("Server is listening at port 8080 ");
})
