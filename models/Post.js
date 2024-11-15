// Mongoose 라이브러리 가져오기
const mongoose = require('mongoose');

// 게시글 스키마 정의
const postSchema = new mongoose.Schema({
  작성자: { type: String, default: null },
  비밀번호: { type: String, default: null },
  제목: { type: String, required: true },
  요리이름: { type: String, required: true},
  썸네일: { type: String },
  재료들: [{
    재료: { type: String, required: true },
    갯수: { type: String, required: true }
  }],
  내용: { type: String, required: true },
  like: { type: Number, default: 0, required: true }
}, {
  collection: 'post',
  timestamps: true
});

module.exports = mongoose.models.Post || mongoose.model('Post', postSchema);
