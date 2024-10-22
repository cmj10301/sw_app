import { FRecipe, Recipe } from "@/interface/api.type";
import { API_URI } from "@/util/constant";
import Link from "next/link";
import { connectDB } from "../../util/database.js";

async function getRecipe() {
  const response = await fetch(API_URI);
  const json = await (await response.json()).COOKRCP01.row as Recipe[];
  return json
}

export default async function Home() {
  const recipes = await getRecipe();
  let db = (await connectDB).db('forum');

  for (const recipe of recipes) {
    // Helper 함수: 접두사와 인덱스를 받아 해당 필드 값을 반환
    const getField = (prefix: string, index: number): string | undefined => {
      return recipe[`${prefix}${String(index).padStart(2, '0')}` as keyof Recipe] as string | undefined;
    };

    // MANUAL 배열 생성
    const manual: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const value = getField('MANUAL', i);
      if (value) {
        manual.push(value);
      }
    }

    // MANUAL_IMG 배열 생성
    const manualImg: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const value = getField('MANUAL_IMG', i);
      if (value) {
        manualImg.push(value);
      }
    }

    // FRecipe 객체 생성
    const filteredRecipe: FRecipe = {
      RCP_SEQ: recipe.RCP_SEQ,
      RCP_NM: recipe.RCP_NM,
      RCP_PARTS_DTLS: recipe.RCP_PARTS_DTLS,
      ATT_FILE_NO_MK: recipe.ATT_FILE_NO_MK,
      ATT_FILE_NO_MAIN: recipe.ATT_FILE_NO_MAIN,
      HASH_TAG: recipe.HASH_TAG,
      RCP_PAT2: recipe.RCP_PAT2,
      RCP_WAY2: recipe.RCP_WAY2,
      like: 0,
      MANUAL: manual,
      MANUAL_IMG: manualImg,
    };

    // MongoDB에 필터링된 데이터 저장 (업데이트 또는 삽입)
    const filter = { RCP_SEQ: filteredRecipe.RCP_SEQ };
    await db.collection('post').updateOne(filter, { $setOnInsert: filteredRecipe }, { upsert: true });
  }

  // const collections = await db.listCollections().toArray();
  // for (const collection of collections) {
  //   await db.collection(collection.name).deleteMany({});
  // } 

  let result = await db.collection('post').find().toArray();

  return (
    <div>
      {result.map((a) => {
        return (
        <div key={a._id}>
          <Link href={`/recipe/${a._id}`}>{a.RCP_NM} </Link>
          <span>👍 : {a.like?a.like:0}</span>
        </div>
      )})}
      <Link href="/">글쓰기</Link>
    </div>
  )
}