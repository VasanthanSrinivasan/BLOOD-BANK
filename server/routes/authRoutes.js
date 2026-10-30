import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = Router();

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Please check the submitted information",
      errors: errors.array(),
    });
  }

  next();
}

function createToken(user) {
  return jwt.sign(
    { sub: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "2h", issuer: "lifeline-api" }
  );
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    hospitalId: user.hospitalId,
  };
}

// Public registration always creates a regular user.
// Users cannot choose their own privileged role.
router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2, max: 100 }),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 12, max: 128 }),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const requestedRole = req.body.role || "donor";
      const publicRoles = ["donor", "patient", "user"];
      if (!publicRoles.includes(requestedRole)) {
        return res.status(403).json({ message: "This account type must be created by an administrator" });
      }

      const existing = await User.findOne({ email });

      if (existing) {
        return res.status(409).json({
          message: "Unable to create account with these details",
        });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await User.create({
        name,
        email,
        password: passwordHash,
        role: requestedRole,
      });

      res.status(201).json({
        message: "Account created successfully",
        user: publicUser(user),
      });
    } catch (error) {
      next(error);
    }
  }
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isString().isLength({ min: 1, max: 128 }),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("+password");

      const validPassword =
        user &&
        await bcrypt.compare(password, user.password);

      if (!validPassword || !user.isActive) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      res.json({
        token: createToken(user),
        user: publicUser(user),
      });
    } catch (error) {
      next(error);
    }
  }
);

// Current logged-in user's profile
router.get("/me", protect, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export default router;