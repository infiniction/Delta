const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";//database wanderlust


main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
await mongoose.connect(MONGO_URL);
}
const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner: "659ba1bf8c4f70cedfe0a724"  }));//to inserting the owner in each listing
    await Listing.insertMany(initData.data);
    console.log("data is initilized");
};
initDB();