const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const { isloggedIn,isOwner,validateListing } = require("../middleware.js");
const { Cursor } = require("mongoose");

const listngController = require("../controllers/listing.js")
const multer = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
// const upload = multer({ dest: 'uploads/' })

router.
    route("/").
    get( wrapAsync(listngController.index)).
    post(
        isloggedIn,
        upload.single('listing[image][url]'),
        validateListing,
        wrapAsync(listngController.createListing)
    );
  
router.get("/")
//New Route
router.get("/new", isloggedIn, listngController.renderNewForm)

router.route("/:id").
    get( wrapAsync(listngController.showListing)).
    put( 
        isloggedIn,
        isOwner, 
        upload.single('listing[image][url]'),
        validateListing, 
        wrapAsync(listngController.updatelisting)).
    delete(isloggedIn,isOwner, wrapAsync(listngController.deletelisting));

//Edit Route
router.get("/:id/edit", isloggedIn,isOwner, wrapAsync(listngController.editListing))


// Index Route
// router.get("/", wrapAsync(listngController.index))

//New Route
// router.get("/new", isloggedIn, listngController.renderNewForm)

// show route
// router.get("/:id", wrapAsync(listngController.showListing));

//create route
// router.post("/",
//     isloggedIn,
//     validateListing,
//     wrapAsync(listngController.createListing))

// //Edit Route
// router.get("/:id/edit", isloggedIn,isOwner, wrapAsync(listngController.editListing))

//update route
// router.put("/:id", isloggedIn,isOwner, validateListing, wrapAsync(listngController.updatelisting));

//Delete Route
// router.delete("/:id", isloggedIn,isOwner, wrapAsync(listngController.deletelisting))

module.exports = router;