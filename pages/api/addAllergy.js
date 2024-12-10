import { connect } from "../../util/database.js";
import users from "../../models/users.js";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { userId, allergy } = req.body;

        if (!userId || !allergy) {
            return res.status(400).json({ message: "유효하지 않은 요청입니다." });
        }

        try {
            await connect();

            // 유저 정보 업데이트
            const user = await users.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
            }

            // 알레르기 추가
            if (!user.알레르기) user.알레르기 = [];
            user.알레르기.push(allergy);
            await user.save();

            res.status(200).json({ message: "알레르기 음식이 추가되었습니다." });
        } catch (error) {
            console.error("Error updating allergy:", error);
            res.status(500).json({ message: "서버 에러가 발생했습니다." });
        }
    } else {
        res.status(405).json({ message: "지원하지 않는 메서드입니다." });
    }
}
