import { ObjectId } from "mongodb";
import { connectDB } from "../../util/database"

export default async function handler(request, response) {
    if (request.method == 'POST') {
        const {제목, 비밀번호, 내용, 재료들, 썸네일} = request.body;
        if (!제목 || !비밀번호 || !내용 || !재료들) {
            return response.status(400).json({error : '필수 항목이 누락됐습니다.'})
        }

        const 바꿀꺼 = {제목, 비밀번호, 내용, 재료들 : 재료들 || [], 썸네일}
        
        const db = (await connectDB).db('forum');
        let result = await db.collection('post').updateOne({_id : new ObjectId(request.body._id)}, {$set : 바꿀꺼})
        response.status(200).json({ message: '데이터가 성공적으로 저장되었습니다.'});
    }
}