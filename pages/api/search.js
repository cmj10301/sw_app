import { connect } from '../../util/database';
import Post from '../../models/Post';
import User from '../../models/users'; // 작성자 정보가 저장된 모델

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { keyword = "", scope = "all", page = 1, limit = 6 } = req.query;
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;

        if (!keyword.trim()) {
            return res.status(400).json({ message: "검색어가 필요합니다." });
        }

        try {
            await connect();

            let query = {};
            switch (scope) {
                case "title":
                    query = { 제목: new RegExp(keyword, "i") };
                    break;
                case "ingredient":
                    query = { "재료들.재료": new RegExp(keyword, "i") };
                    break;
                case "author":
                    // User 컬렉션에서 작성자 이름 검색
                    const users = await User.find({ name: new RegExp(keyword, "i") }, { _id: 1 });
                    const userIds = users.map(user => user._id);
                    query = { 작성자: { $in: userIds } };
                    break;
                default:
                    query = {
                        $or: [
                            { 제목: new RegExp(keyword, "i") },
                            { "재료들.재료": new RegExp(keyword, "i") },
                            { 작성자: { $in: await getAuthorIds(keyword) } } // 작성자 검색 처리
                        ]
                    };
                    break;
            }

            const totalDocuments = await Post.countDocuments(query);

            const data = await Post.find(query, { _id: 1, 제목: 1, like: 1, 썸네일: 1, 작성자: 1 })
                .populate('작성자', 'name image')
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limitNumber);

            res.status(200).json({ data, totalPages: Math.ceil(totalDocuments / limitNumber), currentPage: pageNumber });
        } catch (error) {
            console.error("에러 발생:", error);
            res.status(500).json({ message: "search API 오류", error: error.message });
        }
    } else {
        res.status(405).json({ message: "허용되지 않는 메서드입니다." });
    }

    async function getAuthorIds(keyword) {
        const users = await User.find({ name: new RegExp(keyword, "i") }, { _id: 1 });
        return users.map(user => user._id);
    }
}
