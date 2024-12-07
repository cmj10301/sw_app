import { connect } from '../../util/database.js';
import Like from '../../models/Likes.js';
import Post from '../../models/Post.js';
import { getClientIp } from 'request-ip';
import cookie from 'cookie';

export default async function handler(req, res) {
  const { userId, postId } = req.body;

  if (!postId) {
    return res.status(400).json({ message: "postId가 제공되지 않았습니다." });
  }

  try {
    await connect();
  } catch (error) {
    return res.status(500).json({ message: '데이터베이스 연결 오류가 발생했습니다.' });
  }

  try {
    const ipAddress = getClientIp(req);
    const cookieName = `like_${postId}`;

    const cookies = cookie.parse(req.headers.cookie || '');

    if (userId) {
      // 회원 처리
      const existingLike = await Like.findOne({ userId, postId });

      if (existingLike) {
        // 좋아요 취소
        await Like.deleteOne({ _id: existingLike._id });
        await Post.findByIdAndUpdate(postId, { $inc: { 좋아요: -1 } });

        return res.status(200).json({ liked: false, likeCount: await Like.countDocuments({ postId }) });
      } else {
        // 좋아요 추가
        const newLike = new Like({ userId, postId });
        await newLike.save();
        await Post.findByIdAndUpdate(postId, { $inc: { 좋아요: 1 } });

        return res.status(200).json({ liked: true, likeCount: await Like.countDocuments({ postId }) });
      }
    } else {
      // 비회원 처리
      const existingLike = await Like.findOne({
        postId,
        ipAddress,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      });

      if (existingLike) {
        // 좋아요 취소
        await Like.deleteOne({ _id: existingLike._id });
        await Post.findByIdAndUpdate(postId, { $inc: { 좋아요: -1 } });

        // 쿠키 제거
        res.setHeader(
          'Set-Cookie',
          cookie.serialize(cookieName, '', { maxAge: -1, path: '/' }) // 쿠키 제거
        );

        return res.status(200).json({ liked: false, likeCount: await Like.countDocuments({ postId }) });
      } else {
        // 좋아요 추가
        const newLike = new Like({ postId, ipAddress, createdAt: new Date() });
        await newLike.save();
        await Post.findByIdAndUpdate(postId, { $inc: { 좋아요: 1 } });

        res.setHeader(
          'Set-Cookie',
          cookie.serialize(cookieName, 'true', { maxAge: 24 * 60 * 60, path: '/' })
        );

        return res.status(200).json({ liked: true, likeCount: await Like.countDocuments({ postId }) });
      }
    }
  } catch (error) {
    console.error("좋아요 처리 중 오류 발생:", error.message);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
  }
}
