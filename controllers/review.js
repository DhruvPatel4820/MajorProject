const Review = require("../models/review")
const Listing = require("../models/listing")
module.exports.createReview = async (req, res) => {
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success"," Review is added!")

    res.redirect(`/listings/${listing._id}`);
    // console.log("new review saved");
    // res.send("new review saved ");

}
module.exports.destroyRoute = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review is Deleted!")

    res.redirect(`/listings/${id}`);
}