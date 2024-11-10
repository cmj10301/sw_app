import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import like from "../../../pages/api/like";
import { connectDB } from "../../../util/database.js";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import Modals from '../../../component/modal';
import { Button, Col, Container, Image, Row, Stack } from 'react-bootstrap';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export default async function RecipeDetail({ params: { id } }) {
    const db = (await connectDB).db('forum');
    const result = await db.collection('post').findOne({ _id: new ObjectId(id) })
    const session = await getServerSession(authOptions);

    // const deleteAll = await db.collection('post').deleteMany({});

    async function like_(formData) {
        'use server'
        await like(id, result.like)
        revalidatePath(`/recipe/${id}`)
    }

    const sanitizedContent = DOMPurify.sanitize(result.내용);
    const stringId = result._id.toString();
    return (

        <div>
            <h1>{result.제목}</h1>
            <hr></hr>
            <h1>미리보기 이미지</h1>
            {result.썸네일 ? <Image src={result.썸네일} alt="미리보기 이미지" style={{ width: "150px", height: "auto" }} rounded /> : ""}
            <hr></hr>
            <h2>필요 재료</h2>
            <Container>
                {
                    result.재료들.map((i, a) => {
                        return (
                            <Row key={a}>
                                <Col xs={4}>{i.재료}</Col>
                                <Col xs={2}>{i.갯수}</Col>
                            </Row>
                        )
                    })
                }
            </Container>
            <hr></hr>
            <h2>조리 방법</h2>
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            <hr></hr>
            <form action={like_} className='mb-3'>
                <Button type='submit'>👍 {result.like}</Button>
            </form>
            {session && result?.작성자 === session?.user?.email ? (
                <Stack direction='horizontal' gap={3}>
                    <Modals id={stringId} password={result?.비밀번호} value="수정" />
                    <Modals id={stringId} password={result?.비밀번호} value="삭제" />
                </Stack>
            ) : null}
            {
                result?.비밀번호 
                    ? (<Stack direction='horizontal' gap={3}>
                <Modals id={stringId} password={result?.비밀번호} value="수정" />
                <Modals id={stringId} password={result?.비밀번호} value="삭제" />
            </Stack>) : result?.작성자?.user?.email === session?.user?.email ? (<Stack direction='horizontal' gap={3}>
                <Modals id={stringId} value="수정" />
                <Modals id={stringId} value="삭제" />
            </Stack>) : null
            }

        </div>
    )
}