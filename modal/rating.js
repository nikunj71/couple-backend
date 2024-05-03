import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ratingSchema = new Schema(
  {
    sendUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model set up
      required: true,
    },
    receivedUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model set up
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Rating', ratingSchema);
