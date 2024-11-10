import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

export default async function handler(요청, 응답) {
    console.log('S3 버킷 이름 : ', proce.env.BUCKET_NAME)
    console.log('S3 액세스 키 : ', proce.env.ACCESS_KEY)
    console.log('S3 시크릿 키 : ', proce.env.SECRET_KEY)
    const s3 = new S3Client({
        region: 'ap-northeast-2',
        credentials: {
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEY,
        },
    });

    try {
        const url = await createPresignedPost(s3, {
            Bucket: process.env.BUCKET_NAME,
            Key: 요청.query.file,
            Conditions: [
                ['content-length-range', 0, 5242880], // 파일 용량 5MB까지 제한
            ],
            Expires: 60, // seconds
        });
        url.url = `https://s3.ap-northeast-2.amazonaws.com/${process.env.BUCKET_NAME}`

        응답.status(200).json(url);
    } catch (error) {
        console.error("오류 : ", error);
        응답.status(500).json({ error: error.message });
    }
}
