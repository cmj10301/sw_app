// pages/api/delete.js
import * as database from '../../util/database';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id, password } = JSON.parse(req.body);
    const client = await database.connectDB;
    const db = client.db('forum');

    const post = await db.collection('post').findOne({ _id: new ObjectId(id) });

    if (post && post.비밀번호 === password || password == null) {
      await db.collection('post').deleteOne({ _id: new ObjectId(id) });
      res.status(200).json({ message: 'Deleted successfully' });
    } else {
      res.status(401).json({ message: 'Incorrect password or post not found' });
    }
  }
}
