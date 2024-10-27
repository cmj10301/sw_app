
import like from "@/pages/api/like";
import { connectDB } from "@/util/database.js";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function RecipeDetail({params} : {params:{id:string}}){
    const {id} = await params;

    let db = (await connectDB).db('forum');
    let result = await db.collection('post').findOne({_id : new ObjectId({id})})
    // const manual = Object.keys(result)
    //     .filter(key => key.startsWith('MANUAL') && !key.includes('IMG'))
    //     .map(key => result[key])
    //     .filter(step => step !== "");

    async function like_(formData) {
        'use server'
        await like({id}, result.like)
        revalidatePath(`/recipe/${id}`)
    }
        
    return (
        <div>
            <h1>{result.RCP_NM}</h1>
            {
                result.MANUAL.map((a, i) => {
                    return (
                        <h3 key={i}>{a}</h3>
                    )
                })
            }
            <form action={like_}>
                <button>좋아요</button>
                <span>{result.like}</span>
            </form>
            <Link href={`/edit/${id}`}>수정</Link>
            <button>삭제</button>
        </div>
    )
}