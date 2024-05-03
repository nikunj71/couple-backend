// Import necessary modules
import express from 'express';
import notificationController from '../controller/notificationController.js';
import validateToken from '../middleware/validateToken.js';

// Create a router instance
const router = express.Router();

// Define routes
router.post('/add', validateToken, notificationController.add); // Ensure this route comes before routes that expect an ObjectId parameter

export default router;
