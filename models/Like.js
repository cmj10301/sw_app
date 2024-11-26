const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // User를 참조
    ref: 'User',
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId, // Post를 참조
    ref: 'Post',
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Like || mongoose.model('Like', LikeSchema);
