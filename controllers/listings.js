const Listing = require("../models/listing");


module.exports.index = async(req,res )=>{
    const alllistings = await  Listing.find({});
    res.render("listings/index", { listings: alllistings }); 
    };

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing })
};

module.exports.createListing = (async (req, res) => {
    const data = req.body.listing;
// 🔍 If image object is missing, create default
    if (!data.image || !data.image.url || data.image.url.trim() === "") {
        data.image = {
            filename: "default",
            url: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmVhY2glMjB2YWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        };
    }

    const newListing = new Listing(data);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");

    res.redirect("/listings");
});

module.exports.renderEditForm = async(req,res)=>{
           let {id}=req.params;
            const listing=  await Listing.findById(id);
             if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
            res.render("listings/edit.ejs",{listing});
        };

module.exports.updateListing = async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id); // purani image lene ke liye
        const data = req.body.listing;
        // Agar image string hai (galti se), object bana do
        if (typeof data.image === "string") {
            data.image = { url: data.image, filename: "custom" };
        }
    
        // Agar image blank chhoda gaya, purani image preserve karo
        if (!data.image || !data.image.url || data.image.url.trim() === "") {
            data.image = listing.image;
        }
    
        await Listing.findByIdAndUpdate(id, data);
         req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    };

module.exports.destroyListing = async (req,res)=>{
        let {id}=req.params;
       let deletedlisting=  await Listing.findByIdAndDelete(id);
       console.log(deletedlisting);
       req.flash("success", "Listing Deleted!");
       res.redirect("/listings");
    
    };