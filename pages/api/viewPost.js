import { connect } from "../../util/database";
import Post from "../../models/Post";
import ViewLog from "../../models/ViewLog";
import { getClientIp } from "request-ip"; // IP 주소 가져오는 라이브러리 (npm install request-ip)

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

        const ipAddress = getClientIp(req); // 클라이언트 IP 주소 가져오기
        const userId = req.headers["x-user-id"] || null; // 사용자 ID (헤더에서 가져옴)

        // 최근 조회 기록 확인 (24시간 기준)
        const existingLog = await ViewLog.findOne({
            postId,
            $or: [
                { userId }, // 동일 사용자
                { ipAddress }, // 동일 IP 주소
            ],
            viewedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // 24시간 이내 조회
        });

        if (existingLog) {
            return res.status(200).json({ message: "조회수는 이미 증가되었습니다." });
        }

        // 조회 로그 저장
        await ViewLog.create({
            postId,
            userId,
            ipAddress,
        });

        // 게시물 조회수 증가
        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: { 조회수: 1 } }, // 조회수 증가
            { new: true, timestamps: false } // 수정 시간 무시
        );
        

        if (!post) {
            return res.status(404).json({ message: "게시물을 찾을 수 없습니다." });
        }

        res.status(200).json({ message: "조회수가 증가되었습니다.", 조회수: post.조회수 });
    } catch (error) {
        console.error("조회수 증가 실패:", error);
        res.status(500).json({ message: "서버 에러가 발생했습니다." });
    }
}
