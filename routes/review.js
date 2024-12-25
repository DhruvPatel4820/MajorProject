const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync")
// const ExpressError = require("../utils/ExpressError")
// const { reviewSchema } = require("../schema.js")
const Review = require("../models/review.js");
const {validateReviews,isloggedIn} = require("../middleware.js");
const review = require("../models/review.js");
const {isreviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/review.js")

router.post("/",isloggedIn,validateReviews,wrapAsync(reviewController.createReview));

// Delete Review route
router.delete("/:reviewId",isloggedIn,isreviewAuthor, wrapAsync(reviewController.destroyRoute))

module.exports= router;