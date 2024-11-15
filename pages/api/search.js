import { connect } from '../../util/database'; // Mongoose 연결 초기화
import Post from '../../models/Post';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { keyword = "", page = 1, limit = 6 } = req.query;
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;

        if (!keyword)
            return res.status(400).json({ message: "검색어가 필요합니다." });

        try {
            await connect();
            const query = keyword
            ? { 제목: { $regex: keyword, $options: "i" } }
            : {};

            const totalDocuments = await Post.countDocuments(query);
            const totalPages = Math.ceil(totalDocuments / limitNumber);

            const data = await Post.find(query, { _id: 1, 제목: 1, like: 1, 썸네일: 1, 작성자: 1 })
            .sort({ _id: -1 }) 
            .skip(skip)
            .limit(limitNumber);

            res.status(200).json({ data, totalPages, currentPage: pageNumber });
        } catch (error) {
            res.status(500).json({ message: "search API 오류", error });
        }
    } else {
        res.status(405).json({ message: "허용되지 않는 메서드입니다." });
    }
}