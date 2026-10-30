
import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
  {
    donorId: {
      type: String,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: [
        "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
      ],
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 100,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    availability: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available",
    },
  },
  { timestamps: true }
);

donorSchema.pre("validate", function () {
  if (!this.donorId) {
    this.donorId = `DNR-${new mongoose.Types.ObjectId()
      .toString()
      .slice(-8)
      .toUpperCase()}`;
  }
});

export default mongoose.model("Donor", donorSchema);
