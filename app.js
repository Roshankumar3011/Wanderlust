const express=require("express");
const app=express();
const mongoose =require("mongoose");
const Listing = require('./models/listing.js');
const path =require("path");
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync =require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review = require('./models/review.js');






const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";


main().then(() => {
console.log("connected to DB");
}).catch(err=>{
    console.log("err");
});



async function main() {
    await mongoose.connect(MONGO_URL);
    
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended :true}));
app.use(methodoverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"/public")));


// app.js ya server.js me




app.get("/",(req ,res)=>{
    res.send("Hi ,I am root");

});

const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

app.get("/listings",async(req,res )=>{
    const alllistings = await  Listing.find({});
    res.render("listings/index", { listings: alllistings }); 


    });
// New Route
    app.get("/listings/new",(req,res)=>{

       res.render("listings/new.ejs");
    });
  // show Route

    app.get("/listings/:id",async(req,res)=>{

        let {id}=req.params;
        const listing=  await Listing.findById(id).populate("reviews");
        res.render("listings/show.ejs",{listing});
    });

    //Create Route
    // app.post("/listings",async(req,res)=>{
    //    const newListing =new Listing(req.body.listing);
    //     await newListing.save();
    //     res.redirect("/listings");
   // });

 app.post("/listings",wrapAsync( async (req, res) => {
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
    res.redirect("/listings");

})
);




   // Edit Route
    app.get("/listings/:id/edit",async(req,res)=>{
       let {id}=req.params;
        const listing=  await Listing.findById(id);
        res.render("listings/edit.ejs",{listing});
    });

//update route
// app.put("/listings/:id",async(req,res )=>{
//     let {id}=req.params;
//   await  Listing.findByIdAndUpdate(id,{...req.body.listing});
//   res.redirect(`/listings/${id}`);
// });

app.put("/listings/:id", async (req, res) => {
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
    res.redirect(`/listings/${id}`);
});


//delete route

app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
   let deletedlisting=  await Listing.findByIdAndDelete(id);
   console.log(deletedlisting);
   res.redirect("/listings");

});
// Reviews 
// Post Route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params; 
    const listing = await Listing.findById(id).populate("reviews");
    
    let newReview = new Review(req.body.review); 
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));



// app.get("/testlisting",async(req,res) =>{
 
//     let sampleListing = new Listing({
//       title : "My New Villa",
//       description : "By the Beach",
//       price : 12000,
//       location : "Calangute ,goa",
//       country :" India",
    

//     });

//      await sampleListing.save();
//      console.log("sample was saved");
//      res.send("successful testing");

// });
app.use((err,req,res,next) =>{
    res.send("something went worng");

});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});