import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../modal/user.js';
import catchAsync from '../utils/catchAsync.js';

const generateToken = (user) => {
  const payload = {
    user: {
      id: user.id,
      userName: user.userName,
      email: user.email,
      partnerIds: user.partnerIds,
    },
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // Token expires in 1 hour
  );
};

const authController = {
  // Register user
  register: catchAsync(async (req, res) => {
    const { userName,displayName, email, password, profilePhoto, mobile, partnerIds } =
      req.body;

    let existingUser = await User.findOne({ email: email, is_deleted: false });
    let userNameData = await User.findOne({
      userName: userName,
      is_deleted: false,
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }
    if (userNameData) {
      return res.status(400).json({ message: 'User name already exists.' });
    }
    let checkPartnerWasExists = await User.find({ _id: partnerIds }, '_id');

    let user = new User({
      userName,
      email,
      password,
      profilePhoto,
      mobile,
      displayName,
    });
    if (checkPartnerWasExists.length) {
      user['partnerIds'] = [partnerIds];
      user['type'] = 'secondary';
    } else {
      user['type'] = 'primary';
    }
    user = await user.save();
    if (checkPartnerWasExists.length) {
      checkPartnerWasExists = checkPartnerWasExists.map((item) => item._id);
      await User.updateOne(
        { _id: checkPartnerWasExists[0] },
        { $push: { partnerIds: user._id } }
      );
    }
    res.status(200).json({ message: 'User registered successfully.' });
  }),

  // Login user
  login: catchAsync(async (req, res) => {
    const { email, username, password } = req.body;

    // let user = '';
    let user = await User.findOne({ userName: email, is_deleted: false });
    if(!user){
     user = await User.findOne({ email: email, is_deleted: false });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user);
    res.json({ token });
  }),
};

export default authController;
