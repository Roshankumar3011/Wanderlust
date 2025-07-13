const express =require("express");
const router = express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing = require('../models/listing.js');
const {listingSchema}=require("../schema.js");

const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


router.get("/",async(req,res )=>{
    const alllistings = await  Listing.find({});
    res.render("listings/index", { listings: alllistings }); 


    });
// New Route
    router.get("/new",(req,res)=>{

       res.render("listings/new.ejs");
    });
  // show Route

    // router.get("/:id",async(req,res)=>{

    //     let {id}=req.params;
    //     const listing=  await Listing.findById(id).populate("reviews");
    //     if(!listing){
    //          req.flash("error", "Listing you requested foe does not exist!");
    //          res.redirect("/listings");
    //     }
    //     res.render("listings/show.ejs",{listing});
    // });

    router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings"); // ✅ return added here
    }

    res.render("listings/show.ejs", { listing });
});

     //Create Route
        // app.post("/listings",async(req,res)=>{
        //    const newListing =new Listing(req.body.listing);
        //     await newListing.save();
        //     res.redirect("/listings");
       // });
    
    //  router.post("/",wrapAsync( async (req, res) => {
    //     const data = req.body.listing;
    
    //     // 🔍 If image object is missing, create default
    //     if (!data.image || !data.image.url || data.image.url.trim() === "") {
    //         data.image = {
    //             filename: "default",
    //             url: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmVhY2glMjB2YWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    //         };
    //     }
    
    //     const newListing = new Listing(data);
    //     await newListing.save();
    //     req.flash("sucess","New Listing Created !");
    //     res.redirect("/listings");
    
    // })
    // );

    router.post("/", wrapAsync(async (req, res) => {
    const data = req.body.listing;

    // 🔍 If image object is missing, create default
    if (!data.image || !data.image.url || data.image.url.trim() === "") {
        data.image = {
            filename: "default",
            url: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmVhY2glMjB2YWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        };
    }

    const newListing = new Listing(data);
    await newListing.save();
    req.flash("success", "New Listing Created!");

    res.redirect("/listings");
}));

       // Edit Route
        router.get("/:id/edit",async(req,res)=>{
           let {id}=req.params;
            const listing=  await Listing.findById(id);
             if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings"); // ✅ return added here
    }
            res.render("listings/edit.ejs",{listing});
        });
    
    //update route
    // app.put("/listings/:id",async(req,res )=>{
    //     let {id}=req.params;
    //   await  Listing.findByIdAndUpdate(id,{...req.body.listing});
    //   res.redirect(`/listings/${id}`);
    // });
    
    router.put("/:id", async (req, res) => {
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
    });
    
    
    //delete route
    
    router.delete("/:id",async (req,res)=>{
        let {id}=req.params;
       let deletedlisting=  await Listing.findByIdAndDelete(id);
       console.log(deletedlisting);
       req.flash("success", "Listing Deleted!");
       res.redirect("/listings");
    
    });
    
module.exports = router;