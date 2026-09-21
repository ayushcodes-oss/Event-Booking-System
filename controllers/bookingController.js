const Booking = require("../models/bookingModel");
const Event = require("../models/eventModel");

const createBooking = async (req, res) => {
    try {
        const { eventId, numberOfSeats } = req.body;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }
        if (event.availableSeats < numberOfSeats) {
            return res.status(400).json({
                message: "Not enough seats available"
            });
        }
        const totalPrice = event.price * numberOfSeats;
        const booking = await Booking.create({
            user: req.user.userId,
            event: eventId,
            numberOfSeats: numberOfSeats,
            totalPrice: totalPrice,
            status: "confirmed"
        });
        event.availableSeats -= numberOfSeats;
        await event.save();
        res.status(201).json({
            message: "Booking created successfully",
            booking
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
module.exports = {
  createBooking
}