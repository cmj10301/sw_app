import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import Frige from "../../component/Frige";

export default async function FrigePage() {
    const session = await getServerSession(authOptions);

    return (
        <Frige
            userId={session?.user?._id || null} // userId를 클라이언트 컴포넌트로 전달
        />
    );
}
