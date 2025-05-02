import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: {
      type: mongoose.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    prescriptionURL: {
      type: String,
      required: true,
    },
    medicines: [{
      name: String,
      dosage: String,
      duration: String,
      instructions: String
    }],
    notes: {
      type: String
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", prescriptionSchema); 