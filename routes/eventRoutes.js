const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
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

router.get("/", protect, getEvents);
router.get("/:id", getEventById);
router.post("/", protect, allowRoles("admin"), createEvent);
router.put("/:id", protect, allowRoles("admin"), updateEvent);
router.delete("/:id", protect, allowRoles("admin"), deleteEvent);




module.exports = router;