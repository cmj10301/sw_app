import { connect } from "../../util/database";
import Post from "../../models/Post";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "허용되지 않는 메서드입니다." });
    }

    const { postId } = req.body;

    if (!postId) {
        return res.status(400).json({ message: "게시물 ID가 필요합니다." });
    }

    try {
        await connect();

        // 게시물 조회수 증가
        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: { 조회수: 1 } }, // 조회수 1 증가
            { new: true } // 업데이트된 문서 반환
        );

        if (!post) {
            return res.status(404).json({ message: "게시물을 찾을 수 없습니다." });
        }

        res.status(200).json({ message: "조회수가 증가되었습니다.", 조회수: post.조회수 });
    } catch (error) {
        console.error("Error updating views:", error);
        res.status(500).json({ message: "서버 에러가 발생했습니다." });
    }
}
