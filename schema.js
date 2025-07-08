// const Listing = require("./models/listing");
// const ExpressError = require("./utils/ExpressError.js"); 
// const{listingSchema,reviewSchema} = require("./schema.js");

// module.exports.isLoggedIn = (req, res, next) =>{
//     if(!req.isAuthenticated()){
//         req.session.redirectUrl = req.originalUrl ;

//         req.flash("error","you must be logged in to create listing!");
//         return res.redirect("/login");
//     }
//     next();
// }

// module.exports.saveRedirectUrl =(req, res, next)=> {
//     if(req, res, next) {
//         res.locals.redirectUrl = req.session.redirectUrl;
//     }
//     next()
// }

// module.exports.isOwner = async(req, res, next) =>{
//     let { id } = req.params;
//     let listing = await Listing.findById(id);
//     if(!listing.owner.equals(res.locals.currUser._id)){
//         req.flash("error","you are not the owner of this listing");
//         return res.redirect(`/listings/${id}`);
//     }
//     next()
// }

// // validate listings 
// module.exports.validateListing = (req,res, next) =>{
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }else{
//         next();
//     }
    
// }

// // review validation 

// module.exports.validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body); // Use reviewSchema for validation
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// }


// const Joi = require("joi");

// module.exports.listingSchema = Joi.object({
//     listing : Joi.object({
//         title:Joi.string().required(),
//         description:Joi.string().required(),
//         country:Joi.string().required(),
//         price:Joi.number().required(),
//         image:Joi.string().allow("",null),
//     }).required(),
// });

// module.exports.reviewSchema = Joi.object({
//     listing : Joi.object({
//         rating:Joi.number().required(),
//         Comment:Joi.string().required(),
//     }).required()
// });



const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.string().allow("", null),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({  // 👈 Fixed: 'listing' → 'review'
        rating: Joi.number().required(),
        comment: Joi.string().required(),  // 👈 Fixed: 'Comment' → 'comment'
    }).required()
});
