import { connectDB } from "../../../util/database.js"
import { ObjectId } from "mongodb";

export default async function Edit({params:{id}}) {
    const db = (await connectDB).db("forum");
    const result = await db.collection('post').findOne({_id : new ObjectId(id)})
    return (
        <div>
            <form action='/api/edit'>
                <input type="text" defaultValue={result.제목}></input>
                <button type="submit" value="수정하기"></button>
            </form>
        </div>
    )
}