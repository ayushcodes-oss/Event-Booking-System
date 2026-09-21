const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

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
    averagePriceByCategory,
    searchPerformance
} = require("../controllers/eventController");


router.get("/expensive",getExpensiveEvents);
router.get("/search", searchEvents);
router.get("/sort", sortEvents);
router.get("/count-by-category", countEventsByCategory);
router.get("/average-price-by-category", averagePriceByCategory);
router.get("/search-performance",searchPerformance)
router.post("/", createEvent);
router.get("/", protect, getEvents);
router.get("/:id", getEventById);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);



module.exports = router;