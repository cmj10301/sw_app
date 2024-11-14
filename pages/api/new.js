import { ObjectId } from "mongodb";
import { connectDB } from "../../util/database.js";

export default async function handler(request, response) {
    if (request.method == 'POST') {
        request.body.like = 0

        request.body._id = new ObjectId(request.body._id);

        const db = (await connectDB).db("forum");
        let result = await db.collection('post').insertOne(request.body);

        response.status(200).json({ message: '데이터가 성공적으로 저장되었습니다.'});
    }
}