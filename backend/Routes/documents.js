import express from "express";
import { authenticate, restrict } from "../auth/verifyToken.js";
import {
    uploadReport,
    getUserReports,
    uploadPrescription,
    getUserPrescriptions,
    getDoctorPrescriptions
} from "../Controllers/documentController.js";

const router = express.Router();

// Report routes
router.post("/reports", authenticate, restrict(["patient"]), uploadReport);
router.get("/reports", authenticate, restrict(["patient"]), getUserReports);

// Prescription routes
router.post("/prescriptions", authenticate, restrict(["doctor"]), uploadPrescription);
router.get("/prescriptions/user", authenticate, restrict(["patient"]), getUserPrescriptions);
router.get("/prescriptions/doctor", authenticate, restrict(["doctor"]), getDoctorPrescriptions);

export default router; 