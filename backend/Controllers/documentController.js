import Report from "../models/ReportSchema.js";
import Prescription from "../models/PrescriptionSchema.js";

// Report Controllers
export const uploadReport = async (req, res) => {
    try {
        const { title, reportURL, reportType, description } = req.body;
        const userId = req.userId;

        const newReport = new Report({
            user: userId,
            title,
            reportURL,
            reportType,
            description
        });

        await newReport.save();

        res.status(200).json({
            success: true,
            message: "Report uploaded successfully",
            data: newReport
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to upload report",
            error: err.message
        });
    }
};

export const getUserReports = async (req, res) => {
    try {
        const userId = req.userId;
        const reports = await Report.find({ user: userId }).sort('-uploadDate');

        res.status(200).json({
            success: true,
            message: "Reports fetched successfully",
            data: reports
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch reports",
            error: err.message
        });
    }
};

// Prescription Controllers
export const uploadPrescription = async (req, res) => {
    try {
        const { patientId, bookingId, prescriptionURL, medicines, notes } = req.body;
        const doctorId = req.userId;

        const newPrescription = new Prescription({
            doctor: doctorId,
            patient: patientId,
            booking: bookingId,
            prescriptionURL,
            medicines,
            notes
        });

        await newPrescription.save();

        res.status(200).json({
            success: true,
            message: "Prescription uploaded successfully",
            data: newPrescription
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to upload prescription",
            error: err.message
        });
    }
};

export const getUserPrescriptions = async (req, res) => {
    try {
        const userId = req.userId;
        const prescriptions = await Prescription.find({ patient: userId })
            .populate('doctor', 'name photo specialization')
            .populate('booking', 'appointmentDate')
            .sort('-uploadDate');

        res.status(200).json({
            success: true,
            message: "Prescriptions fetched successfully",
            data: prescriptions
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch prescriptions",
            error: err.message
        });
    }
};

export const getDoctorPrescriptions = async (req, res) => {
    try {
        const doctorId = req.userId;
        const prescriptions = await Prescription.find({ doctor: doctorId })
            .populate('patient', 'name photo')
            .populate('booking', 'appointmentDate')
            .sort('-uploadDate');

        res.status(200).json({
            success: true,
            message: "Prescriptions fetched successfully",
            data: prescriptions
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch prescriptions",
            error: err.message
        });
    }
}; 