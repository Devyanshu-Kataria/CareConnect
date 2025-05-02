import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    reportURL: {
      type: String,
      required: true,
    },
    reportType: {
      type: String,
      required: true,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema); 