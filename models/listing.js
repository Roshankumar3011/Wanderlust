const mongoose =require("mongoose");
const  Schema = mongoose.Schema;

// const listeningSchema =new mongoose.Schema({
//     title : { 
//         type :String,
//         require :true,
//     },
//     description : String,
//     image : { 
//         type :String,
//         default :"https://www.bing.com/images/search?view=detailV2&ccid=7cRYFyLo&id=11F625C091BC67023AF87A027746ADC2EE6CB644&thid=OIP.7cRYFyLoDEDh4sRtM73vvwHaDg&mediaurl=https%3a%2f%2fimages.pexels.com%2fphotos%2f459225%2fpexels-photo-459225.jpeg%3fcs%3dsrgb%26dl%3ddaylight-environment-forest-459225.jpg%26fm%3djpg&exph=2848&expw=6000&q=free+image+forest&simid=608039706631810662&FORM=IRPRST&ck=410E2BCBE47D07FED39FC9925742E537&selectedIndex=2&itb=0",
//         set : (v)=> v===""?
//         "https://www.bing.com/images/search?view=detailV2&ccid=7cRYFyLo&id=11F625C091BC67023AF87A027746ADC2EE6CB644&thid=OIP.7cRYFyLoDEDh4sRtM73vvwHaDg&mediaurl=https%3a%2f%2fimages.pexels.com%2fphotos%2f459225%2fpexels-photo-459225.jpeg%3fcs%3dsrgb%26dl%3ddaylight-environment-forest-459225.jpg%26fm%3djpg&exph=2848&expw=6000&q=free+image+forest&simid=608039706631810662&FORM=IRPRST&ck=410E2BCBE47D07FED39FC9925742E537&selectedIndex=2&itb=0" 
//         :v,
//         },
//     url : String,
//     price : Number,
//     location : String,
//     country : String,
//});

//const listing =mongoose.model("listing",listeningSchema);
//module.exports=listing;



//const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    location: String,
    country: String,
    image: {
        filename: String,
        url: String
    },
     reviews:[
        {
         type : Schema.Types.ObjectId,
         ref:"Review"

        },
     ],
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;