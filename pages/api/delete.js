// pages/api/delete.js
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import * as database from '../../util/database';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const s3 = new S3Client({
    region : process.env.REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
    },
  }) 
  if (req.method === 'DELETE') {
    const { id, password } = JSON.parse(req.body);

    const client = await database.connectDB;
    await client.connect(); // 명시적 연결
    const db = client.db('forum');

    const post = await db.collection('post').findOne({ _id: new ObjectId(id) });
    
    if (post && (post.비밀번호 === password || password == null)) {
      // 게시글 삭제
      await db.collection('post').deleteOne({ _id: new ObjectId(id) });

      // 이미지 URL에서 키 추출 및 삭제
      const srcMatches = [...post.내용.matchAll(/src="([^"]+)"/g)];
      if (srcMatches.length > 0) {
        const imageKeys = srcMatches.map(match => {
          const fullUrl = match[1];
          const key =  fullUrl.split('.com/')[1];
          return key.replace('swimagebucket/', '')
        });

        try {
          const deletePromises = imageKeys.map(key => {
            const command = new DeleteObjectCommand({
              Bucket: process.env.BUCKET_NAME,
              Key: key,
            });
            return s3.send(command);
          });

          await Promise.all(deletePromises);
          console.log("s3 이미지 삭제 완료.");
        } catch (error) {
          console.error('이미지 삭제 중 오류 발생:', error);
          return res.status(500).json({ message: 'Error deleting images from S3' });
        }
      }

      res.status(200).json({ message: 'Deleted successfully' });
    } else {
      res.status(401).json({ message: 'Incorrect password or post not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
