import { connect } from '../../util/database';

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { ingredients, isMainOnly, excludeAllergy } = req.body;

    console.log(req.body);

    await connect();

    // 데이터베이스 쿼리 생성
    const query = {
        재료들: {
            $elemMatch: {
                재료이름: { $in: ingredients }, // 재료 이름이 입력된 재료 중 하나인 게시글
                ...(isMainOnly && { isMain: true }), // 필수 재료만 검색
            },
        },
        ...(excludeAllergy && { 알레르기: { $exists: false } }), // 알레르기 정보가 없는 게시글
    };

    try {
        const results = await YourDatabaseModel.find(query); // 데이터베이스 검색
        res.status(200).json(results);
    } catch (error) {
        console.error("DB 검색 오류:", error);
        res.status(500).json({ error: "검색 중 오류가 발생했습니다." });
    }
}
