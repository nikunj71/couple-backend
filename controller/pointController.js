
import Rating from '../modal/rating.js';
import User from '../modal/user.js';
import catchAsync from '../utils/catchAsync.js';
import admin from 'firebase-admin';
import serviceAccount from '../couple-rating-cd2e5-firebase-adminsdk-qci2c-2e1ac6558b.json' assert { type: 'json' };
import FCM from "fcm-node"
import notification from '../modal/notification.js';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (fcmToken,userId,message) => {
    const fcm = new FCM(
      'AAAAtojBO6U:APA91bEqpsy53-WJMKQxfRkVdOHge7VN8V7cO00Z2uZx1KiPH9Rb7aq24LTHEXJStSzRzBQ2Y76xX5sEu4TFeUziPQHIzoiwW-Qs844_DlWY16ckafp4ZC3Rf8t4JVTBw-3VmqfX_3Pc'
    );
    const allToken = await notification.findOne({ userId: userId });
    if(allToken.token.length){
        console.log('allToken', allToken.token);
        const pushMessage = {
          registration_ids: allToken.token,
          content_available: true,
          mutable_content: true,
          notification: {
            title: 'Rating Notification',
            body: message,
          },
        };
        console.log('pushMessage', pushMessage)
        fcm.send(pushMessage, function (err, res) {
          if (err) {
            console.log('Something has gone wrong!', err);
          } else {
            console.log('Successfully sent with response: ', res);
          }
        });
    }
};

const pointController = {
  add: catchAsync(async (req, res) => {
    const { userId, rating, comment } = req.body;
    const currentUser = req.user;

    try {
      if (userId === currentUser.user.id) {
        return res.status(400).json({
          message: `You can't give points to yourself—spread the kindness to others!`,
        });
      }
      const userData = await User.findOne({ _id: userId, is_deleted: false });

      if (!userData) {
        return res.status(404).send('Receiver User not found');
      }

      // Calculate points, assuming positive ratings add points and negative subtract
      const pointsChange = rating; // Customize this logic based on your rating scale
      userData.points += pointsChange;

      await User.updateOne(
        { _id: userData._id },
        { $set: { points: userData?.points } }
      );

      const newRating = new Rating({
        sendUserId: currentUser.user.id,
        receivedUserId: userData._id,
        rating: rating,
        comment: comment,
      });

      await newRating.save();

      const token =
        'AAAAtojBO6U:APA91bEqpsy53-WJMKQxfRkVdOHge7VN8V7cO00Z2uZx1KiPH9Rb7aq24LTHEXJStSzRzBQ2Y76xX5sEu4TFeUziPQHIzoiwW-Qs844_DlWY16ckafp4ZC3Rf8t4JVTBw-3VmqfX_3Pc';
      const message = `You have received a rating. Your new points total is ${userData.points}`;
      await sendNotification(token, userData._id, message);

      res.status(200).send({
        message: 'Rating added successfully',
        userPoints: userData.points,
      });
    } catch (error) {
      console.error('Error adding rating:', error);
      res.status(500).send('Internal Server Error');
    }
  }),
  list: catchAsync(async (req, res) => {
    const { startValue, endValue } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // try {
    const RatingList = await Rating.find({
      $and: [
        {
          createdAt: {
            $gte: new Date(startValue),
            $lte: new Date(endValue),
          },
        },
        {
          $or: [
            { sendUserId: req.user.user.id },
            { receivedUserId: req.user.user.id },
          ],
        },
      ],
    })
      // .skip(skip)
      // .limit(limit)
      .populate({ path: 'receivedUserId' })
      .populate({ path: 'sendUserId' });

    res.send({
      page,
      limit,
      totalPages: Math.ceil(RatingList.length / limit),
      total: RatingList.length,
      data: RatingList,
    });
    // } catch (error) {
    //   console.error('Error getting users:', error);
    //   res.status(500).send('Internal Server Error');
    // }
  }),
};

export default pointController;
