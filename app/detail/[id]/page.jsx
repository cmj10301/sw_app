import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import like from "../../../pages/api/like";
import { connect } from "../../../util/database.js";
import Post from '../../../models/Post';
import { revalidatePath } from "next/cache";
import Modals from '../../../component/modal';
import { Button, Col, Container, Image, Row, Stack } from 'react-bootstrap';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export default async function RecipeDetail({ params: { id } }) {
    await connect();

    // `작성자` 필드를 populate하여 닉네임 가져오기
    const result = await Post.findById(id).populate("작성자", "name").lean() || {};
    const session = await getServerSession(authOptions) || {};

    const isUpdated = result.updatedAt > result.createdAt;
    const displayDate = new Date(isUpdated ? result.updatedAt : result.createdAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    const dateLabel = isUpdated ? "수정된 날짜" : "작성 날짜";

    async function handleLike() {
        'use server';
        const updatedPost = await like(id, result?.like || 0);
        revalidatePath(`/recipe/${id}`);
    }

    const sanitizedContent = DOMPurify.sanitize(result?.내용 || "조리 방법이 설정되지 않았습니다.");
    const stringId = result._id.toString();

    return (
        <div>
            <h1>{result.제목}</h1>
            <h1>{result.요리이름}</h1>
            <hr />
            <h1>미리보기 이미지</h1>
            {result.썸네일 && (
                <Image src={result.썸네일} alt="미리보기 이미지" style={{ width: "150px", height: "auto" }} rounded />
            )}
            <hr />
            <h2>필요 재료</h2>
            <Container>
                {(result.재료들 || []).map((i, a) => (
                    <Row key={a}>
                        <Col xs={4}>{i.재료}</Col>
                        <Col xs={2}>{i.갯수}</Col>
                    </Row>
                ))}
            </Container>
            <hr />
            <h2>조리 방법</h2>
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            <hr />
            <form action={handleLike} className="mb-3">
                <Button type="submit">👍 {result?.like || 0}</Button>
            </form>
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

            <p>작성자 : {result?.작성자?.name || "익명"}</p>
            <span>{dateLabel}: {displayDate}</span>
        </div>
    );
}
