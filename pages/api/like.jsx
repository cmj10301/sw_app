import { connectDB } from "@/util/database.js";
import { ObjectId } from "mongodb";

export default async function like(id) {
    let db = (await connectDB).db('forum');
    await db.collection('post').updateOne(
        {_id : new ObjectId(id)},
        {$inc : {like : 1}},
        {new : true, upsert : true})
}