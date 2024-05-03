import admin from 'firebase-admin';
import catchAsync from '../utils/catchAsync.js';
import Notification from '../modal/notification.js';
import Rating from '../modal/rating.js';





const notificationController = {
  add: catchAsync(async (req, res) => {
    const token = req.body.deviceTokenID;
    const { user } = req.user;
    console.log('token', user);

    try {
      let notification = await Notification.findOne({ userId: user.id });

      if (notification) {
        // If the user already has a token stored, update it (this logic may need to be adjusted based on your requirements)
        if (!notification.token.includes(token)) {
          notification.token.push(token);
        }
      } else {
        // If no existing record, create a new one
        notification = new Notification({ userId: user.id, token: [token] });
      }

      await notification.save();

      res
        .status(201)
        .json({ message: 'Token saved successfully', data: notification });
    } catch (error) {
      console.error('Error saving token:', error);
      res.status(500).json({ message: 'Error saving token', error: error });
    }
  }),

};

export default notificationController;
