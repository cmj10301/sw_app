import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import like from "../../../pages/api/like";
import { connectDB } from "../../../util/database.js";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import DeleteModal from '../../../component/modal';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export default async function RecipeDetail({params}){
    const {id} = await params;

    let db = (await connectDB).db('forum');
    let result = await db.collection('post').findOne({_id : new ObjectId({id})})

    async function like_(formData) {
        'use server'
        await like({id}, result.like)
        revalidatePath(`/recipe/${id}`)
    }

    const sanitizedContent = DOMPurify.sanitize(result.내용);
    const stringId = result._id.toString();
    return (
        
        <div>
            <h1>{result.제목}</h1>
            <hr></hr>
            <h2>필요 재료</h2>
            {
                result.재료들.map((i, a)=> {
                    return (
                        <ul key = {a}>
                            <li>{i.재료}, {i.갯수}개</li>
                        </ul>
                    )
                })
            }
            <div dangerouslySetInnerHTML={{__html : sanitizedContent}}/>
            <hr></hr>
            <form action={like_}>
                <button>좋아요</button>
                <span>{result.like}</span>
            </form>
            <Link href={`/edit/${id}`}>수정</Link>
            <DeleteModal postId={stringId} postPassword={result.비밀번호}></DeleteModal>
        </div>
    )
}