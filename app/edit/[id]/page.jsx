import PostForm from "../../../component/PostForm"
import { connect } from "../../../util/database.js";
import Post from "../../../models/Post";

export default async function Edit({ params: { id } }) {
    await connect();

    let result = await Post.findById(id).lean()
    if (!result) {
        return <div>게시물을 찾을 수 없습니다.</div>;
    }

    const initialData = {
        ...result,
        _id: result._id.toString(),
    }

    return (
        <PostForm
            initialData={initialData}
            id={id}
            password={result.비밀번호}
            author={result.작성자 ? result.작성자.user.email : null}>
        </PostForm>
    )
} 