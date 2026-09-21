const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required : true
  },
  event :{
    type : mongoose.Schema.Types.ObjectId,
    ref :"Event",
    required : true
  },
  numberOfSeats :{
    type : Number,
    required : true,
    min :1
  },
  totalPrice : {
    type: Number,
    required: true,
    min: 0
  },
   status: {
    type: String,
    enum: ["confirmed", "cancelled"],
    default: "confirmed"
    }

});

module.exports = mongoose.model("Booking",bookingSchema);