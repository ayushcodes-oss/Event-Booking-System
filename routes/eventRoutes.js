const express = require("express");
const router = express.Router();

const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getExpensiveEvents,
    searchEvents,
    sortEvents,
    countEventsByCategory,
    averagePriceByCategory
} = require("../controllers/eventController");


router.get("/expensive",getExpensiveEvents);
router.get("/search", searchEvents);
router.get("/sort", sortEvents);
router.get("/count-by-category", countEventsByCategory);
router.get("/average-price-by-category", averagePriceByCategory);
router.post("/", createEvent);
router.get("/", getEvents);
router.get("/:id", getEventById);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);



module.exports = router;