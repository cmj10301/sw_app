import PostForm from "../../../component/PostForm"
import { connect } from "../../../util/database.js";
import Post from "../../../models/Post";

export default async function Edit({ params: { id } }) {
    await connect();

    let result = await Post.findById(id).lean();

    const initialData = {
        ...result,
        _id: result._id.toString(),
        작성자: result.작성자 ? result.작성자.toString() : null,
    }

    return (
        <PostForm
            initialData={initialData}
            id={id}
            password={initialData.비밀번호}
            author={initialData.작성자 ? initialData.작성자: null}>
        </PostForm>
    )
} 