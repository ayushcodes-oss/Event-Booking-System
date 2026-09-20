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


module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
};