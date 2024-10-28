import Link from "next/link";
import { connectDB } from "../../util/database.js";
import styles from "../../styles/home.module.css"

// async function getRecipe() {
//   const response = await fetch(API_URI);
//   const json = await (await response.json()).COOKRCP01.row;
//   return json
// }

export default async function Home() {
  let db = (await connectDB).db('forum');

  let result = await db.collection('post').find().toArray();
  return (
    <div>
      {result.map((a) => {
        return (
        <div key={a._id} className={styles.div}>
          <img src={a.ATT_FILE_NO_MAIN} alt={a.RCP_NM} className={styles.img}/>
          <Link className={styles.a}href={`/recipe/${a._id}`}>{a.RCP_NM} </Link>
          <span>👍 : {a.like?a.like:0}</span>
        </div>
      )})}
      <Link href="/write">글쓰기</Link>
    </div>
  )
}