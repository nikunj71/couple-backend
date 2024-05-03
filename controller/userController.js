import User from '../modal/user.js';
import catchAsync from '../utils/catchAsync.js';

const userController = {
  update: catchAsync(async (req, res) => {
    const { userName, email, profilePhoto, mobile } = req.body;

    try {
      let existingUser = await User.findOne({ email: email });
      let username  = await User.findOne({ userName: userName });
      
        if (existingUser && existingUser?._id.toString() !== req.params.id) {
          return res.status(404).json({ message: 'User already exists.' });
        }
        if (username && username?._id.toString() !== req.params.id) {
          return res.status(404).json({ message: 'User name already exists.' });
        }
      const updatedUser = await User.updateOne(
        { _id: req.params.id },
        {
          $set: {
            userName,
            email,
            profilePhoto,
            mobile,
          },
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
      const user = await User.findOne({ _id: userId }).populate({ path:"partnerIds"})

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      res.send(user);
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).send('Internal Server error');
    }})
};

export default userController;
