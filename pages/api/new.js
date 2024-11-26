import mongoose from "mongoose";
import Post from "../../models/Post";
import { connect } from "../../util/database";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { _id, 작성자, 비밀번호, 제목, 썸네일, 재료들, 내용, 좋아요 } = req.body;

        await connect();

        // 작성자가 없거나 유효하지 않을 경우 null로 설정
        const 작성자id = 작성자 && mongoose.Types.ObjectId.isValid(작성자)
            ? new mongoose.Types.ObjectId(작성자)
            : null;

        try {
            const newPost = new Post({
                _id : new ObjectId(_id),
                작성자: 작성자id,
                비밀번호,
                제목,
                썸네일,
                재료들,
                내용,
                좋아요
            });
            await newPost.save();

            res.status(200).json({ message: "데이터가 성공적으로 저장되었습니다." });
        } catch (error) {
            console.error("저장 중 오류:", error);
            res.status(500).json({ message: "데이터 저장에 실패했습니다.", error });
        }
    } else {
        res.status(405).json({ message: "허용되지 않은 요청 방식입니다." });
    }
}
