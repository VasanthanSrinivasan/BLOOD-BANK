import { protect, allowRoles } from "../middleware/auth.js";

import { Router } from "express";
import mongoose from "mongoose";
import Donor from "../models/Donor.js";

const router = Router();
router.use(protect);

const allowedFields = [
  "name",
  "email",
  "phone",
  "bloodGroup",
  "age",
  "city",
  "lastDonationDate",
  "availability",
];

function getDonorInput(body) {
  return Object.fromEntries(
    allowedFields
      .filter((key) => body[key] !== undefined)
      .map((key) => [key, body[key]])
  );
}

// READ: list and search donors
router.get("/", allowRoles("admin", "hospital", "hospital_staff", "doctor"), async (req, res, next) => {
  try {
    const { search = "", bloodGroup, page = "1", limit = "10" } = req.query;
    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 10));

    const filter = {};

    if (bloodGroup) filter.bloodGroup = bloodGroup;

    if (search.trim()) {
      const safeSearch = search.trim().slice(0, 100).replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
      filter.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { donorId: { $regex: safeSearch, $options: "i" } },
        { city: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const [donors, total] = await Promise.all([
      Donor.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Donor.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: donors,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
});

// READ: get one donor
router.get("/:id", allowRoles("admin", "hospital", "hospital_staff", "doctor"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid donor ID" });
    }

    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.json({ success: true, data: donor });
  } catch (error) {
    next(error);
  }
});

// CREATE: register donor
router.post("/", allowRoles("admin","hospital","hospital_staff"), async (req, res, next) => {
  try {
    const donor = await Donor.create(getDonorInput(req.body));
    res.status(201).json({ success: true, data: donor });
  } catch (error) {
    next(error);
  }
});

// UPDATE: edit donor
router.patch("/:id", allowRoles("admin","hospital","hospital_staff"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid donor ID" });
    }

    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      { $set: getDonorInput(req.body) },
      { new: true, runValidators: true }
    );

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.json({ success: true, data: donor });
  } catch (error) {
    next(error);
  }
});

// DELETE: remove donor
router.delete("/:id", allowRoles("admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid donor ID" });
    }

    const donor = await Donor.findByIdAndDelete(req.params.id);

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.json({ success: true, message: "Donor deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
