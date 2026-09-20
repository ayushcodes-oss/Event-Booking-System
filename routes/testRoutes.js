const express = require("express");
const router = express.Router();
const Event = require("../models/eventModel");

router.post("/event-test",async(req,res)=>{
  try{
    const event = await Event.create(req.body);
    res.status(201).json(event);
  }catch(error){
    res.status(500).json({
      message : error.message
    });
  }
});

module.exports = router;