import { getServerSession } from "next-auth";
import PostForm from "../../component/PostForm";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export default async function Write() {
    const session = await getServerSession(authOptions);
    return (
        <PostForm userInfo={session? session : null}></PostForm>
    )
}