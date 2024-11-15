import { connect } from "../../../util/database";
import bcrypt from 'bcrypt';
import UserCred from "../../../models/UserCred";

export default async function POST(req, res) {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        req.body.password = hash;

        await connect();

        const newUser = new UserCred(req.body);
        await newUser.save();

        res.status(200).json("성공");
    } catch (error) {
        console.error("데이터 저장 오류:", error);
        res.status(500).json("서버 오류 발생");
    }
}
