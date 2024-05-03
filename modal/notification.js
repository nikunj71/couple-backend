import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model set up
      required: true,
    },
    token: [{
      type: String,
      required: false,
    }],
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
