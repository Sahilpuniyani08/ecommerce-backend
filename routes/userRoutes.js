import express from "express";
import { getUsers, loginUser, registerUser } from "../controllers/userController.js";



const router = express.Router();

// Register user
router.post("/register", registerUser);
router.post("/login", loginUser);
// Get all users (for admin)
router.get("/", getUsers);

export default router;
