import mongoose from "mongoose";
const schema = new mongoose.Schema({
  bloodBankId: { type: String, unique: true, required: true },
  name: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  contact: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  status: { type: String, enum: ["Active", "Inactive", "Pending"], default: "Active" },
  demoRecord: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model("BloodBank", schema);
