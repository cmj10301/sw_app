import { ObjectId } from "mongodb";

export default function handler(req, res) {
    if (req.method === 'GET') {
        const newId = new ObjectId().toString();
        res.status(200).json({id : newId});
    } else {
        res.status(405).json({message : 'Method not allowed'})
    }
}