import { connect } from '../../util/database';
import Post from '../../models/Post';
import User from '../../models/users'; // 사용자 테이블 가져오기

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: '허용되지 않는 메서드입니다.' });
    }

    const { userId, ingredients = [], isMainOnly = false, excludeAllergy = false, page = 1, limit = 6 } = req.body;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const ingredientArray = Array.isArray(ingredients)
        ? ingredients
        : typeof ingredients === 'string'
        ? ingredients.trim().split(' ')
        : [];

    if (ingredientArray.length === 0) {
        return res.status(400).json({ message: '검색어가 필요합니다.' });
    }

    try {
        await connect();

        // 사용자 알레르기 조회
        let allergyArray = [];
        if (excludeAllergy && userId) {
            const user = await User.findById(userId).lean();
            if (user && Array.isArray(user.알레르기)) {
                allergyArray = user.알레르기;
            }
        }

        // 검색 조건 설정
        let query = {};
        if (isMainOnly) {
            query = {
                재료들: {
                    $elemMatch: {
                        재료: { $in: ingredientArray, $nin: allergyArray }, // 입력된 재료 중 알레르기를 제외
                        isMain: true,
                    },
                },
            };
        } else {
            query = {
                재료들: {
                    $elemMatch: {
                        재료: { $in: ingredientArray, $nin: allergyArray }, // 알레르기 제외
                    },
                },
            };
        }

        // 데이터베이스에서 게시글 검색
        const totalDocuments = await Post.countDocuments(query);
        const data = await Post.find(query)
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limitNumber);

        res.status(200).json({
            data,
            totalPages: Math.ceil(totalDocuments / limitNumber),
            currentPage: pageNumber,
        });
    } catch (error) {
        console.error('에러 발생:', error);
        res.status(500).json({ message: 'frige_search API 오류', error: error.message });
    }
}
