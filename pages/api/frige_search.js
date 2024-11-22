import { connect } from '../../util/database';
import Post from '../../models/Post';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: '허용되지 않는 메서드입니다.' });
    }

    // 기본값 설정 및 타입 확인
    const { ingredients = [], isMainOnly = false, page = 1, limit = 6 } = req.body;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // ingredients가 문자열이면 split, 그렇지 않으면 그대로 배열로 사용
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

        // 검색 조건 설정
        let query = {};
        if (isMainOnly) {
            query = {
                재료들: {
                    $elemMatch: {
                        재료: { $in: ingredientArray }, // 입력된 재료 중 하나
                        isMain: true, // 필수 재료 조건
                    },
                },
            };
        } else {
            query = {
                재료들: {
                    $elemMatch: {
                        재료: { $in: ingredientArray },
                    },
                },
            };
        }

        // 데이터베이스에서 게시글 검색
        const totalDocuments = await Post.countDocuments(query);
        const data = await Post.find(query)
            .sort({ _id: -1 }) // 최신순 정렬
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
