import User from '../modal/user.js';
import catchAsync from '../utils/catchAsync.js';

const userController = {
  update: catchAsync(async (req, res) => {
    const { userName, email } = req.body;

    try {
      let existingUser = await User.findOne({
        email: email,
        is_deleted: false,
      });
      let username = await User.findOne({
        userName: userName,
        is_deleted: false,
      });

      if (existingUser && existingUser?._id.toString() !== req.params.id) {
        return res.status(404).json({ message: 'User already exists.' });
      }
      if (username && username?._id.toString() !== req.params.id) {
        return res.status(404).json({ message: 'User name already exists.' });
      }

      const updatedUser = await User.updateOne(
        { _id: req.params.id },
        {
          $set: req.body.is_deleted
            ? { is_deleted: true, partnerIds: [] }
            : req.body,
        }
      );
      await User.updateOne(
        { partnerIds: { $in: [req.params.id] } },
        {
          $pull: { partnerIds: req.params.id },
        }
      );

      res.send(updatedUser);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: 'Email already exists.' });
      }
      console.error('Error updating user:', error);
      res.status(500).send('Internal Server error');
    }
  }),

  single: catchAsync(async (req, res) => {
    const userId = req.params.id;

    try {
      const user = await User.findOne({
        _id: userId,
        is_deleted: false,
      }).populate({
        path: 'partnerIds',
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      res.send(user);
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).send('Internal Server error');
    }
  }),
  searchUsers: catchAsync(async (req, res) => {
    try {
      const name = req.query.search;
      const users = await User.find({
        $and: [
          {
            $or: [
              { userName: { $regex: name, $options: 'i' } },
              { email: { $regex: name, $options: 'i' } },
              { displayName: { $regex: name, $options: 'i' } },
            ],
          },
          { partnerIds: { $eq: [] } },
          { invitations: { $eq: [] } },
          { _id: { $ne: req.user.user.id } },
          { is_deleted: false },
        ],
      });
      res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
          users,
        },
      });
    } catch (error) {
      res.status(500).send('Internal Server error');
    }
  }),

  invitation: catchAsync(async (req, res) => {
    try {
      const { email } = req.body;
      const { user } = req.user;
      await User.updateOne(
        { email: email },
        { $push: { invitations: user?.id } }
      );
      res.status(200).json({
        status: 'success',
        message: 'Invitation sent successfully.',
      });
    } catch (error) {
      res.status(500).send('Internal Server error');
    }
  }),
};

export default userController;
