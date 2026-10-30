import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    // role: {
    //   type: String,
    //   enum: [
    //     "admin",
    //     "doctor",
    //     "patient",
    //     "hospital",
    //     "hospital_staff",
    //     "donor",
    //     "user",
    //   ],
    //   default: "user",
    //   required: true,
    // },
    role: {
      type: String,
      enum: [
        "admin",
        "doctor",
        "patient",
        "hospital",
        "hospital_staff",
        "blood_bank_staff",
        "donor",
        "user",
      ],
      default: "user",
      required: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
