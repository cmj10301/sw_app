import Link from "next/link";
import { connectDB } from "../../util/database.js";
import { Container, ListGroup, ListGroupItem } from "react-bootstrap";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let db = (await connectDB).db('forum');
  let result = await db.collection('post').find().toArray();

  return (
    <div>
      <h2>글 목록</h2>
      <ListGroup className="mx-5">
        {result.map((a) => {
          return (
          <ListGroupItem key={a._id} action href={`/detail/${a._id}`}>
            {/* <img src={a.미리보기이미지} alt={a.이름} className={styles.img}/> */}
            {a.제목}
            <span>👍 : {a.like?a.like:0}</span>
          </ListGroupItem>
        )})}
      </ListGroup>
      <Link href="/write" className="btn btn-primary m-4">✏️글쓰기</Link>
    </div>
  )
}