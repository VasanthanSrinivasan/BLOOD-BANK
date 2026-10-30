import mongoose from "mongoose";

const schema = new mongoose.Schema({
  requestId: { type: String, unique: true, required: true },
  patient: { type: String, required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  hospital: { type: String, required: true },
  group: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], required: true },
  units: { type: Number, min: 1, required: true },
  priority: { type: String, enum: ["Critical", "High", "Normal"], default: "Normal" },
  status: { type: String, enum: ["Pending", "Approved", "Completed", "Rejected"], default: "Pending" },
  date: { type: Date, default: Date.now },
  demoRecord: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model("BloodRequest", schema);
