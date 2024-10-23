import { connectDB } from "@/util/database";

export default async function handler(request, response) {
    if (request.method == 'POST') {
        console.log(request.body.manual)
        const db = (await connectDB).db("forum");
        let result = await db.collection('post').insertOne(request.body)
        response.status(200).redirect('/')
    }
}