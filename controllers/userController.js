import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { userSchema, loginSchema } from "../validators/userValidators.js";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";

// ✅ Register new user
export const registerUser = async (req, res) => {
  try {
    // validate with Zod
    const parsed = userSchema.parse(req.body);

    // check if user exists
    const existingUser = await User.findOne({ email: parsed.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // create user (password will be hashed in pre-save hook)
    const user = new User(parsed);
    await user.save();
    // generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token, // ✅ return token
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      // ✅ validation error (e.g. password too short, invalid email, etc.)
      return res.status(400).json({
        success: false,
        message: error.errors[0].message,
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Login user
export const loginUser = async (req, res) => {
  try {
    const parsed = loginSchema.parse(req.body);


    const user = await User.findOne({ email: parsed.email });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const isMatch = await user.comparePassword(parsed.password);

    if (!isMatch) {
      return res.status(400).json({ message: "password is incorrect" });
    }

    const token = generateToken(user._id, user.role)

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: error.errors[0].message,
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};