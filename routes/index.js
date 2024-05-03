import express from 'express';
import authRoutes from './authRoutes.js';
import userRouters from './userRouters.js';
import pointRouters from './pointRouters.js';
import notificationRouter from './notificationRouter.js';
import uploadController from '../controller/uploadController.js';


const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRouters);
router.use('/point', pointRouters);
router.use('/notification', notificationRouter);
router.post('/imageUpload', uploadController.upload);

export default router;
