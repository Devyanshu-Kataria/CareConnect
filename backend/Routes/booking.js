import express from "express";
import { authenticate, restrict } from "../auth/verifyToken.js";
import { 
    createBooking,
    getUserBookings,
    getDoctorBookings,
    updateBookingStatus
} from "../Controllers/bookingController.js";

const router = express.Router();

// Create a new booking
router.post("/", authenticate, createBooking);

// Get user's bookings
router.get("/my-bookings", authenticate, restrict(["patient"]), getUserBookings);

// Get doctor's bookings
router.get("/doctor-bookings", authenticate, restrict(["doctor"]), getDoctorBookings);

// Update booking status
router.put("/:id", authenticate, restrict(["doctor"]), updateBookingStatus);

export default router;
