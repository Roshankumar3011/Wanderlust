const express =require("express");
const router = express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const Listing = require('../models/listing.js');
const {isLoggedIn,isOwner,validateListing }=require("../middleware.js");
const listingController = require("../controllers/listings.js");

//Index Route
 router.get("/",wrapAsync(listingController.index));

// New Route
   router.get("/new",isLoggedIn,listingController.renderNewForm);

// Show Route
    router.get("/:id",listingController.showListing);

//Create Route
    router.post("/",isLoggedIn, wrapAsync(listingController.createListing));

// Edit Route
    router.get("/:id/edit",isLoggedIn,isOwner,listingController.renderEditForm);
    
//Update route
    
    router.put("/:id",isLoggedIn, isOwner, wrapAsync(listingController.updateListing));

//delete route  
    router.delete("/:id",isLoggedIn,isOwner,listingController.destroyListing);
    
module.exports = router;