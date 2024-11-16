import PostForm from "../../../component/PostForm"
import { connect } from "../../../util/database.js";
import Post from "../../../models/Post";

export default async function Edit({ params: { id } }) {
    await connect();

    let result = await Post.findById(id)
        .populate('작성자', 'email')
        .lean();

    const initialData = {
        ...result,
        _id: result._id.toString(),
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