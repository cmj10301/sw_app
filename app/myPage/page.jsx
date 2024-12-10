import { getServerSession } from "next-auth";
import { Container, Image, Row, Col, Alert, Modal } from "react-bootstrap";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { connect } from "../../util/database.js";
import Link from "next/link";
import users from "../../models/users.js";
import Post from "../../models/Post.js";
import AllergiesModal from "../../component/allergiesModal.jsx";

export default async function MyPage() {
    const session = (await getServerSession(authOptions)) || {};

    try {
        await connect();
        const user = session.user ? await users.findById(session.user._id).lean() : null;
        const posts = user ? await Post.find({ 작성자: user._id }).lean() : [];

        // 유저 ID를 문자열로 변환
        const userId = user?._id.toString();

        return (
            <Container>
                {session.user ? (
                    <div>
                        <Row>
                            <Col xs={12} md={4}>
                                <Image
                                    src={user?.image || "/default-avatar.png"}
                                    alt="프로필 이미지"
                                    roundedCircle
                                    width={100}
                                    height={100}
                                />
                            </Col>
                            <Col xs={12} md={8}>
                                <h3>{user?.name || "익명 사용자"}</h3>
                                <p>
                                    <strong>이메일:</strong> {user?.email || "알 수 없음"}
                                </p>
                                <p>
                                    <strong>알레르기 음식:</strong> {user?.알레르기?.join(", ") || "등록되지 않음"}
                                    <AllergiesModal userId={userId} />
                                </p>
                                <Link href={`https://github.com/${user?.name}`} target="_blank">
                                    <button className="btn btn-primary">GitHub 프로필 보기</button>
                                </Link>
                            </Col>
                        </Row>
                        <hr />

                        <h4>쓴 글</h4>
                        {posts.length > 0 ? (
                            <ul style={{ paddingLeft: "0", listStyleType: "none" }}>
                                {posts.map((post) => (
                                    <li
                                        key={post._id}
                                        style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "5px",
                                            padding: "10px",
                                            marginBottom: "10px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <Link
                                                href={`/detail/${post._id}`}
                                                style={{
                                                    textDecoration: "none",
                                                    color: "black",
                                                    fontWeight: "bold",
                                                    fontSize: "1.1em",
                                                }}
                                            >
                                                {post.제목}
                                            </Link>
                                        </div>
                                        <div style={{ marginLeft: "10px", fontSize: "0.9em", color: "#555" }}>
                                            👍 {post.좋아요 || 0}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Alert variant="info">작성한 글이 없습니다.</Alert>
                        )}
                    </div>
                ) : (
                    <h1>로그인 후 이용해주세요.</h1>
                )}
            </Container>
        );
    } catch (error) {
        console.error("Error loading MyPage:", error);
        return (
            <Container>
                <Alert variant="danger">데이터를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.</Alert>
            </Container>
        );
    }
}