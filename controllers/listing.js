const Listing = require("../models/listing")
module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/Listing.ejs", { allListing });
}
module.exports.renderNewForm = (req, res) => {
    // console.log(req.user);//it print the valid user info
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    }).
    populate("owner");
    if (!listing) {
        req.flash("error", " Listing you requisted does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    const url = req.file.path;
    const filename = req.file.filename;
    console.log(url, "...",filename);
    // const newlisting = new Listing({
    //     ...req.body.listing,
    //     image: {
    //         url: req.body.listing.image.url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtnvAOajH9gS4C30cRF7rD_voaTAKly2Ntaw&s",
    //     },
    // });
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;//adding current user info
    newlisting.image={url,filename};
    console.log(newlisting);
    await newlisting.save();
    req.flash("success", "new Listing is created!")
    res.redirect("/listings");
}
module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", " Listing you requisted does not exist!")
        res.redirect("/listings")
    }
   const originalImageUrl= listing.image.url;
   Url=originalImageUrl.replace("/upload","/upload/c_thumb,g_face,h_200,w_200/r_max/");
    res.render("listings/edit.ejs", { listing,Url});
}
module.exports.updatelisting = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=="undefined"){
        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    // const updatedListing = await Listing.findByIdAndUpdate(
    //     id,
    //     {
    //         ...req.body.listing,
            // image: {
            //     url: req.body.listing.image?.url || "https://images.unsplash.com/photo-1641808886171-3d300caed21a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            //     filename: req.body.listing.image?.filename || "listingimage",
            // },
        // },
        // { new: true }
    // );
    req.flash("success", " Listing is updated!")
    res.redirect(`/listings/${id}`);
}
module.exports.deletelisting = async (req, res) => {
    let { id } = req.params;
    let DeleteItem = await Listing.findByIdAndDelete(id);
    console.log(DeleteItem);
    req.flash("success", " Listing is delete!")

    res.redirect("/listings");
}