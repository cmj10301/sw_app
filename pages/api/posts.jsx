import { connectDB } from "../../util/database.js";
export default async function handler(req, res) {
    const { page = 1, limit = 10 } = req.query; // 기본 페이지와 한 페이지의 항목 수 설정
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    try {
        const db = (await connectDB).db('forum');
        const collection = db.collection('post');

        const totalDocuments = await collection.countDocuments(); // 전체 문서 수 계산
        const totalPages = Math.ceil(totalDocuments / limitNumber);

        const data = await collection.find()
            .sort({ _id: -1 }) // 최신 글 순으로 정렬
            .skip(skip)
            .limit(limitNumber)
            .toArray();

        res.status(200).json({ data, totalPages, currentPage: pageNumber });
    } catch (error) {
        res.status(500).json({ error: "데이터를 가져오는 중 오류가 발생했습니다." });
    }
}
