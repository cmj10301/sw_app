// API 핸들러
import { connect } from '../../util/database';
import Post from '../../models/Post';

export default async function handler(req, res) {
    const { page = 1, limit = 6 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    try {
        await connect();

        const totalDocuments = await Post.countDocuments();

        const totalPages = Math.ceil(totalDocuments / limitNumber);

        const data = await Post.find({}, { _id: 1, 제목: 1, like: 1, 썸네일: 1, 작성자: 1 })
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limitNumber);

        res.status(200).json({ data, totalPages, currentPage: pageNumber });
    } catch (error) {
        res.status(500).json({ error: "데이터를 가져오는 중 오류가 발생했습니다." });
    }
}
