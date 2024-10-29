// pages/api/delete.js
import * as database from '../../util/database';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { postId, password } = req.body;
    const client = await database.connectDB;
    const db = client.db('forum');

    const post = await db.collection('post').findOne({ _id: new ObjectId(postId) });

    if (post && post.비밀번호 === password) {
      await db.collection('post').deleteOne({ _id: new ObjectId(postId) });
      res.status(200).json({ message: 'Deleted successfully' });
    } else {
      res.status(401).json({ message: 'Incorrect password or post not found' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
