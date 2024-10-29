import { connectDB } from "../../util/database.js";
import { ObjectId } from "mongodb";

export default async function like(id, like) {
    let db = (await connectDB).db('forum');
    await db.collection('post').updateOne({_id : new ObjectId(id)}, {$set : {like : like + 1}})
}