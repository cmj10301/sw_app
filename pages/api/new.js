import { connect } from '../../util/database'; // Mongoose 연결 초기화
import Post from '../../models/Post';

export default async function handler(request, response) {
    if (request.method === 'POST') {
        await connect();
        const newPost = new Post(request.body);

        try {
            // 데이터 저장
            await newPost.save();
            response.status(200).json({ message: '데이터가 성공적으로 저장되었습니다.' });
        } catch (error) {
            response.status(500).json({ message: '데이터 저장에 실패했습니다.', error });
        }
    } else {
        response.status(405).json({ message: '허용되지 않은 요청 방식입니다.' });
    }
}
