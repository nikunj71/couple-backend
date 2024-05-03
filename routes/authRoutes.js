// Import necessary modules
import express from 'express';
import authController from '../controller/authController.js';

// Create a router instance
const router = express.Router();

// Define routes
router.post('/register', authController.register);// Ensure this route comes before routes that expect an ObjectId parameter
router.post('/login', authController.login);// Ensure this route comes before routes that expect an ObjectId parameter

// Export the router
export default router;
