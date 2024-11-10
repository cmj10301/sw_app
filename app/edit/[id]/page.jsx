import PostForm from "../../../component/PostForm"
import { connectDB } from "../../../util/database.js";
import { ObjectId } from "mongodb";

export default async function Edit({params : {id}}) {
    let db = (await connectDB).db('forum');
    let result = await db.collection('post').findOne({_id : new ObjectId({id})})
    const initialData = {
        ...result,
        _id : result._id.toString(),
    }

    return <PostForm initialData = {initialData} id={id} password={result.비밀번호} author = {result.작성자 ? result.작성자.user.email : null}></PostForm>
}