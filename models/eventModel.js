const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title:{
    type:String,
    required : true,
    trim :true,
    minlength : 3
  },
  description : {
    type : String,
    required : true
  },
  location : {
    type: String,
    required : true
  },
  date :{
    type : Date,
    required : true
  },
  price : {
    type : Number,
    required : true,
    min : 0
  },
  availableSeats :{
    type : Number,
    required : true,
    min : 1
  },
  category :{
    type: mongoose.Schema.Types.ObjectId,
    ref : "Category",
    required :true
  },
});

module.exports = mongoose.model("Event",eventSchema);