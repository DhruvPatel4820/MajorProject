const Listing = require("./models/listing")
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema ,reviewSchema} = require("./schema.js")

module.exports.isloggedIn = (req,res,next)=>{
    // console.log(req.user);
    console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login")
        // return res.redirect("/listings");
    }
    next();
}

//in belove line we create a middleware
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // console.log(listing.owner)
    // console.log(res.locals.curtUser._id);
    if(!listing.owner.equals(res.locals.curtUser._id)){
        req.flash("error","you are not the owner of listing")
        return res.redirect(`/listings/${id}`)
    }
    next();
}
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",")
        //jab bhi aditional  error detail aati h tab eska use karte h9
        throw new ExpressError(400, errmsg)
    } else {
    next();
    }
}
module.exports.validateReviews = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");//jab bhi aditional  error detail aati h tab eska use karte h9
        throw new ExpressError(400, errmsg)
    } else {
        next();
    }
}

module.exports.isreviewAuthor = async(req,res,next)=>{
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curtUser._id)){
        req.flash("error","you are not the owner of listing")
        return res.redirect(`/listings/${id}`)
    }
    next();
}