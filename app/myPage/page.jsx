import { getServerSession } from "next-auth";
import { Container } from "react-bootstrap";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { connect } from "../../util/database.js";
import Link from "next/link";
import users from '../../models/users';

export default async function MyPage() {
    const session = await getServerSession(authOptions) || {};
    
    await connect();
    const result = await users.findById(session.user._id).populate("name").lean() || {};

    return (
        <div>
            <Container>
                이름: {result.name}
                <Link href={`https://github.com/${result.name}`} target="blank">
                <img src={result.image} alt="프로필 이미지" width={"50px"}/></Link>
                <hr></hr>
                이메일 : {result.email}
                <hr></hr>
                알레르기 음식 : 
            </Container>
        </div>
    )
}