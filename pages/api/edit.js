import { connect } from "../../util/database.js";
import Post from "../../models/Post.js";


export default async function handler(request, response) {
    if (request.method == 'POST') {
        const {제목, 비밀번호, 내용, 재료들, 썸네일} = request.body;
        if (!제목 || !내용 || !재료들) {
            return response.status(400).json({error : '필수 항목이 누락됐습니다.'})
        }

        const 바꿀꺼 = {제목, 비밀번호, 내용, 재료들 : 재료들 || [], 썸네일}
        await connect();

        try {
            let result = await Post.findByIdAndUpdate(
                request.body._id,
                { $set: 바꿀꺼 },
                { new: true, useFindAndModify: false }
            );

            response.status(200).json({ message: '데이터가 성공적으로 저장되었습니다.', result });
        } catch (error) {
            console.error("데이터 업데이트 오류:", error);
            response.status(500).json({ error: "데이터 업데이트 중 오류가 발생했습니다." });
        }
    } else {
        response.status(405).json({ error : "허용되지 않는 메서드입니다."});
    }
}