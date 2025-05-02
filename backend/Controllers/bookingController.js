// import User from '../models/UserSchema.js';
// import Doctor from '../models/DoctorSchema.js';
// import Booking from '../models/BookingSchema.js';
// import Stripe from 'stripe';

// export const getCheckoutSession = async (req, res) => {
//     try {
//         // get currently booked doctor
//         const doctor = await Doctor.findById(req.params.doctorId);
//         const user = await User.findById(req.userId);

//         const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//         // calculate amount in smallest currency unit (cents)
//         const amountInCents = Math.round(doctor.ticketPrice * 100);

//         // create stripe checkout session
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             mode: 'payment',
//             success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
//             cancel_url: `${req.protocol}://${req.get('host')}/doctors/${doctor.id}`,
//             customer_email: user.email,
//             client_reference_id: req.params.doctorId,
//             line_items: [
//                 {
//                     price_data: {
//                         currency: 'inr',
//                         unit_amount: amountInCents,
//                         product_data: {
//                             name: doctor.name,
//                             description: doctor.bio,
//                             images: [doctor.photo]
//                         }
//                     },
//                     quantity: 1
//                 }
//             ]
//         });

//         // create new booking
//         const booking = new Booking({
//             doctor: doctor._id,
//             user: user._id,
//             ticketPrice: doctor.ticketPrice,
//             session: session.id
//         });

//         await booking.save();

//         res.status(200).json({ success: true, message: 'Successfully paid', session });
//     } catch (err) {
//         console.error('Error creating checkout session:', err);
//         res.status(500).json({ success: false, message: "Error creating checkout session" });
//     }
// };


import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';
import Booking from '../models/BookingSchema.js';

export const createBooking = async (req, res) => {
    try {
        const { doctorId, appointmentDate } = req.body;
        const userId = req.userId;

        // Validate doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        // Validate user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Create new booking
        const newBooking = new Booking({
            doctor: doctorId,
            user: userId,
            appointmentDate: new Date(appointmentDate),
        });

        // Save the booking
        await newBooking.save();

        res.status(200).json({ 
            success: true, 
            message: 'Appointment booked successfully',
            data: newBooking
        });

    } catch (err) {
        console.error('Error creating booking:', err);
        res.status(500).json({ 
            success: false, 
            message: "Error booking appointment",
            error: err.message 
        });
    }
};

// Get bookings for a user
export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.userId })
            .populate({
                path: 'doctor',
                select: 'name photo specialization ticketPrice'
            })
            .sort('-createdAt');

        res.status(200).json({ 
            success: true, 
            message: 'Bookings found',
            data: bookings
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to get bookings'
        });
    }
};

// Get bookings for a doctor
export const getDoctorBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ doctor: req.userId })
            .populate('user')
            .sort('-createdAt');

        res.status(200).json({ 
            success: true, 
            message: 'Bookings found',
            data: bookings
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to get bookings'
        });
    }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking status updated successfully',
            data: booking
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to update booking status'
        });
    }
};
