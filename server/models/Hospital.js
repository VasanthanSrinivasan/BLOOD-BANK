import mongoose from "mongoose";

const schema = new mongoose.Schema({
  hospitalId: { type: String, unique: true, required: true },
  name: { type: String, required: true, trim: true },
  city: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  status: { type: String, enum: ["Active", "Pending", "Inactive"], default: "Active" },
  demoRecord: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model("Hospital", schema);
