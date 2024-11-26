import { connect } from '../../util/database.js';
import Like from '../../models/Like';
import Post from '../../models/Post'; // 게시물 정보 가져오기

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId, postId } = req.query;

  // 데이터베이스 연결
  await connect();

  try {
    // 게시물의 좋아요 수 가져오기
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }

    // 특정 사용자가 좋아요를 눌렀는지 여부 확인
    const existingLike = userId ? await Like.findOne({ userId, postId }) : null;

    return res.status(200).json({
      isLiked: !!existingLike,
      likeCount: post.좋아요 || 0,
    });
  } catch (error) {
    console.error('좋아요 상태 확인 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}
