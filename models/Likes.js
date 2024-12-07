const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  ipAddress: {
    type: String, // 비회원의 IP 주소
  },
}, { timestamps: true });

export default mongoose.models.Like || mongoose.model('Like', LikeSchema);
