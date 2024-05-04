// Import necessary modules
import express from 'express';
import userController from '../controller/userController.js';
import validateToken from '../middleware/validateToken.js';


// Create a router instance
const router = express.Router();

// Define routes
router.put('/update/:id',validateToken, userController.update); // Ensure this route comes before routes that expect an ObjectId parameter
router.get('/:id',validateToken, userController.single); // Ensure this route comes before routes that expect an ObjectId parameter
router.get('/', validateToken, userController.searchUsers); // Ensure this route comes before routes that expect an ObjectId parameter
router.post('/invitation', validateToken, userController.invitation); // Ensure this route comes before routes that expect an ObjectId parameter


// Export the router
export default router;
