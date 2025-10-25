import express from "express";
import { createContactQuery } from "../controllers/contactController.js";



const router = express.Router();

router.post("/", createContactQuery); 


export default router;
