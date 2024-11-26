import { connect } from '../../util/database.js';
import Like from '../../models/Like.js';
import Post from '../../models/Post.js'

export default async function handler(req, res) {
  const { userId, postId } = req.body;

  try {
    await connect();
  } catch (error) {
    console.error('데이터베이스 연결 중 오류 발생:', error);
    return res.status(500).json({ message: '데이터베이스 연결 오류가 발생했습니다.' });
  }

  try {
    if (userId) {
      console.log('userId:', userId);
      console.log('postId:', postId);

      // 좋아요 여부 확인
      const existingLike = await Like.findOne({ userId, postId });
      console.log('existingLike:', existingLike);

      if (existingLike) {
        // 이미 좋아요를 눌렀다면, 취소 처리
        await Like.deleteOne({ _id: existingLike._id });
        console.log('좋아요 취소 처리 완료');

        // Post의 좋아요 수 감소
        await Post.findByIdAndUpdate(postId, { $inc: { 좋아요: -1 } });
        console.log('게시글 좋아요 수 감소 완료');

        return res.status(200).json({ liked: false });
      } else {
        // 좋아요가 없으면 새로 추가
        const newLike = new Like({ userId, postId });
        await newLike.save();
        console.log('좋아요 추가 완료');

        // Post의 좋아요 수 증가
        await Post.findByIdAndUpdate(postId, { $inc: { 좋아요: 1 } });
        console.log('게시글 좋아요 수 증가 완료');

        return res.status(200).json({ liked: true });
      }
    } else {
      console.log('로그인되지 않은 사용자 요청');
      return res.status(400).json({ message: '로그인되지 않은 사용자입니다.' });
    }
  } catch (error) {
    console.error('좋아요 처리 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}
