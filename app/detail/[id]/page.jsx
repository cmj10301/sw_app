import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import like from "../../../pages/api/like";
import { connectDB } from "../../../util/database.js";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import Modals from '../../../component/modal';
import { Col, Container, Row } from 'react-bootstrap';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export default async function RecipeDetail({params:{id}}){
    let db = (await connectDB).db('forum');
    let result = await db.collection('post').findOne({_id : new ObjectId(id)})

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
            <h2>필요 재료</h2>
            <Container>
            {
                result.재료들.map((i, a)=> {
                    console.log(a)
                    return (
                        <Row key = {a}>
                            <Col>{i.재료}</Col>
                            <Col>{i.갯수}</Col>x
                        </Row>
                    )
                })
            }
            </Container>
            <div dangerouslySetInnerHTML={{__html : sanitizedContent}}/>
            <hr></hr>
            <form action={like_}>
                <button>좋아요</button>
                <span>{result.like}</span>
            </form>
            <Modals id={stringId} password = {result.비밀번호} value="수정"/>
            <Modals id={stringId} password = {result.비밀번호} value="삭제"/>
        </div>
    )
}