// Import necessary modules
import express from 'express';
import pointController from '../controller/pointController.js';
import validateToken from '../middleware/validateToken.js';

// Create a router instance
const router = express.Router();

// Define routes
router.post('/add',validateToken, pointController.add); // Ensure this route comes before routes that expect an ObjectId parameter
router.post('/list', validateToken, pointController.list); // Ensure this route comes before routes that expect an ObjectId parameter


export default router;
