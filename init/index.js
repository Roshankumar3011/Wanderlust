const mongoose =require("mongoose");
const initdata = require("./data.js");
const Listing=require("../models/listing.js");



const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";


main().then(() => {
console.log("connected to DB");
}).catch(err=>{
    console.log("err");
});
async function main() {
    await mongoose.connect(MONGO_URL);
    
}

const initDB= async() =>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"6873cd1608dcc1774af4e0f0"}));
    await Listing.insertMany(initdata.data);
    console.log("data  was initialized");
};
initDB();

// seeds/index.js
// const axios = require("axios");
// const streamifier = require("streamifier");
// const { cloudinary } = require("../utils/cloudConfig");

// const initDB = async () => {
//   await Listing.deleteMany({});
//   const updatedData = [];

//   for (let obj of initdata.data) {
//     try {
//       const response = await axios.get(obj.image.url, { responseType: "arraybuffer" });

//       const stream = streamifier.createReadStream(response.data);

//       const uploadResult = await new Promise((resolve, reject) => {
//         const streamUpload = cloudinary.uploader.upload_stream(
//           { folder: "wanderlust_seed" },
//           (error, result) => {
//             if (result) resolve(result);
//             else reject(error);
//           }
//         );
//         stream.pipe(streamUpload);
//       });

//       obj.image.url = uploadResult.secure_url;
//       obj.image.filename = uploadResult.public_id;
//       obj.owner = "6873cd1608dcc1774af4e0f0";

//       updatedData.push(obj);
//       console.log(`✅ Uploaded: ${obj.title}`);
//     } catch (err) {
//       console.error(`❌ Failed to upload image for ${obj.title}:`, err.message);
//     }
//   }

//   await Listing.insertMany(updatedData);
//   console.log("✅ Data was initialized with Cloudinary images");
// };
