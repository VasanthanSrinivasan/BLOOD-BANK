import mongoose from "mongoose";

const schema = new mongoose.Schema({
  inventoryId: { type: String, unique: true, required: true },
  group: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], required: true, unique: true },
  units: { type: Number, min: 0, required: true },
  minimum: { type: Number, min: 0, required: true },
  updated: { type: Date, default: Date.now },
  demoRecord: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model("BloodInventory", schema);
