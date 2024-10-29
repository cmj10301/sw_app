import Link from "next/link";
import { connectDB } from "../../util/database.js";
import styles from "../../styles/home.module.css"

export default async function Home() {
  let db = (await connectDB).db('forum');
  let result = await db.collection('post').find().toArray();

  return (
    <div>
      {result.map((a) => {
        return (
        <div key={a._id} className={styles.div}>
          {/* <img src={a.미리보기이미지} alt={a.이름} className={styles.img}/> */}
          <Link className={styles.a} href={`/detail/${a._id}`}>{a.제목} </Link>
          <span>👍 : {a.like?a.like:0}</span>
        </div>
      )})}
      <Link href="/write">글쓰기</Link>
    </div>
  )
}