const Event = require("../models/eventModel");
const Category = require("../models/categoryModel");


// create Evebt
const createEvent = async (req, res) => {
    try {
        const {title,description,location,date,price,availableSeats,category} = req.body;
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        const event = await Event.create({
            title,
            description,
            location,
            date,
            price,
            availableSeats,
            category
        });

        res.status(201).json(event);

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Event title already exists"
            });
        }
        res.status(500).json({
            message: error.message
        });
    }
};

// Get all events
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate("category");
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get events by id
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate("category");
        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Update events
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }
        res.status(200).json(event);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Event title already exists"
            });
        }
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete event
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }
        res.status(200).json({
            message: "Event deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// expensive of event
const getExpensiveEvents = async(req,res) =>{
  try{
    const price = Number(req.query.price);
    const events = await Event.find({
      price :{
        $gt : price
      }
    }).populate("category");
   res.status(200).json(events);
  }catch(error){
    res.status(500).json({
      message : error.message
    });
  }
}

// search events
const searchEvents = async (req, res) => {
    try {
        const title = req.query.title;
        const events = await Event.find({
            title: {
                $regex: title,
                $options: "i"
            }
        }).populate("category");
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// sort events by price
const sortEvents = async(req,res)=>{
  try{
    const order = req.query.order;
    let sortOrder = 1;
    if(order === "desc"){
      sortOrder = -1;
    }
    const events = await Event.find().sort({price : sortOrder}).populate("category");
    res.status(200).json(events);
  }catch(error){
    res.status(500).json({
      message : error.message
    });
  }
}

// Count events by category
const countEventsByCategory = async (req, res) => {
    try {
        const events = await Event.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            }
        ]);
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Average price by category
const averagePriceByCategory = async (req, res) => {
    try {
        const events = await Event.aggregate([
            {
                $group: {
                    _id: "$category",
                    averagePrice: { $avg: "$price" }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            }
        ]);
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Search performance
const searchPerformance = async (req, res) => {
    try {
        const title = req.query.title;
        const result = await Event.find({
            title: {
                $regex: title,
                $options: "i"
            }
        }).explain("executionStats");
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getExpensiveEvents,
    searchEvents,
    sortEvents,
    countEventsByCategory,
    averagePriceByCategory,
    searchPerformance,
};