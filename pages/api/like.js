import Post from "../../models/Post.js";
import { connect } from "../../util/database.js";

export default async function like(id, likeCount) {
    await connect();

    await Post.updateOne(
        { _id : id},
        { $set : {like : likeCount + 1} }
    )
}