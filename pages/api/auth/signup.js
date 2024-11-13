import { connectDB } from "../../../util/database";

export default async function POST(req, res) {
    const hash = await bycrypt.hash(req.body.password, 10);
    req.body.password = hash;

    const db = (await connectDB).db('forum');
    await db.collection('user_cred').insetOne(req.body);
    res.status(200).json("성공");
}