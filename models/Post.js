// Mongoose 라이브러리 가져오기
import mongoose from 'mongoose';
// 게시글 스키마 정의
const postSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  작성자: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  비밀번호: { type: String, default: null },
  제목: { type: String, required: true },
  썸네일: { type: String },
  재료들: [{
    재료: { type: String, required: true },
    갯수: { type: String, required: true },
    단위: { type: String, },
    그램: { type: String, },
    isMain : {type : Boolean, default : false},
    _id : false
  }],
  내용: { type: String, required: true },
  like: { type: Number, default: 0, required: true }
}, {
  collection: 'post',
  timestamps: true
});

export default mongoose.models.Post || mongoose.model('Post', postSchema);
