import { connect } from "../../util/database.js";
import users from "../../models/users.js";
import mongoose from "mongoose";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { userId, allergies } = req.body;

        // 요청 데이터 검증
        if (!userId || !Array.isArray(allergies) || allergies.length === 0) {
            console.error("Invalid input:", { userId, allergies });
            return res.status(400).json({ message: "유효하지 않은 요청입니다." });
        }

        try {
            await connect();

            const user = await users.findById(new mongoose.Types.ObjectId(userId));
            if (!user) {
                console.error("User not found:", userId);
                return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
            }

            // 알레르기 추가 (중복 방지)
            const updateResult = await users.updateOne(
                { _id: new mongoose.Types.ObjectId(userId) },
                { $addToSet: { 알레르기: { $each: allergies } } } // 배열로 추가
            );

            if (updateResult.modifiedCount === 0) {
                console.error("알레르기 추가 실패:", { userId, allergies });
                return res.status(500).json({ message: "알레르기 음식 추가에 실패했습니다." });
            }

            console.log("알레르기 추가 성공:", allergies);
            res.status(200).json({ message: "알레르기 음식이 추가되었습니다." });
        } catch (error) {
            console.error("Error updating allergy:", error);
            res.status(500).json({ message: "서버 에러가 발생했습니다." });
        }
    } else {
        res.status(405).json({ message: "지원하지 않는 메서드입니다." });
    }
}
