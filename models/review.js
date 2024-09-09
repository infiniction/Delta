const mongoose=require("mongoose");
const Schema=mongoose.Schema;
//yeh poora folder collections ka hai

// review is one to one many bcz ek hotel ke liye bhut sare review ho skte hai

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min:  1,
        max: 5,
    },
    createdAt : {
        type: Date,
        default : Date.now()// yeh date dood deta hai
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports= mongoose.model("Review", reviewSchema);