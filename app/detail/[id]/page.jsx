import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { connect } from "../../../util/database.js";
import Post from '../../../models/Post';
import Modals from '../../../component/modal';
import { Col, Container, Image, Row, Stack } from 'react-bootstrap';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';
import LikeBtn from '../../../component/likeBtn';
import ViewIncrementer from "../../../component/ViewIncrementer.jsx";

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export default async function RecipeDetail({ params: { id } }) {
    await connect();

    const result = await Post.findById(id).populate("작성자", "name").lean() || {};
    const session = await getServerSession(authOptions) || {};

    const isUpdated = result.updatedAt > result.createdAt;
    const displayDate = new Date(isUpdated ? result.updatedAt : result.createdAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

    const sanitizedContent = DOMPurify.sanitize(result?.내용 || "조리 방법이 설정되지 않았습니다.");
    const stringId = result._id.toString();

    return (
        <div>
            <h1>{result.제목}</h1>
            <hr />
            <h1>미리보기 이미지</h1>
            {result.썸네일 && (
                <Image src={result.썸네일} alt="미리보기 이미지" style={{ width: "150px", height: "auto" }} rounded />
            )}
            <hr />
            <h2>필요 재료</h2>
            <Container>
                {(result.재료들 || []).map((i, a) => (
                    <Row key={a} className="align-items-center">
                        <Col xs={4}>
                            {i.재료}
                            {i.isMain && (
                                <span style={{ color: 'red', marginLeft: '8px' }}>*</span>
                            )}
                        </Col>
                        <Col xs={2}>{i.갯수} {i.단위}</Col>
                        {
                            i.그램 ? (<Col>{i.그램}g</Col>) : ""
                        }
                    </Row>
                ))}
            </Container>
            <hr />
            <h2>조리 방법</h2>
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            <hr />
            
            <LikeBtn initialLike={result.좋아요} postId={id} userId={session?.user?._id || null} />

            {(result?.비밀번호 || result?.작성자?._id?.toString() === session?.user?._id) && (
                <Stack direction="horizontal" gap={3}>
                    <Modals
                        id={stringId}
                        password={result?.비밀번호 || undefined}
                        value="수정"
                    />
                    <Modals
                        id={stringId}
                        password={result?.비밀번호 || undefined}
                        value="삭제"
                    />
                </Stack>
            )}

            <hr></hr>

            <p>작성자 : {result?.작성자?.name || "익명"}</p>
            {
                isUpdated ? (
                    <div>
                        <span>작성 날짜 : {new Date(result.createdAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}</span>
                        <br></br>
                        <span>수정된 날짜 : {new Date(result.updatedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}</span>
                    </div>
                ) : (
                    <span>작성 날짜 : {new Date(result.createdAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}</span>
                )
            }
            조회수 : {result.조회수}
            <ViewIncrementer postId={id}/>
        </div>
    );
}
