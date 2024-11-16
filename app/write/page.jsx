import { getServerSession } from "next-auth";
import PostForm from "../../component/PostForm";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export default async function Write() {
    const session = await getServerSession(authOptions);

    const userInfo = session
        ? {
            id: session.user._id, // User 컬렉션의 ObjectId
            email: session.user.email,
            name: session.user.name,
        }
        : null;

    return (
        <PostForm userInfo={userInfo}></PostForm>
    );
}
