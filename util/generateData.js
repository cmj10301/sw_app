const { MongoClient } = require('mongodb');
const { faker } = require('@faker-js/faker');

async function insertDummyData() {
    const uri = 'mongodb+srv://cmj10301:kRdBu9Pd3xp9CAqL@cluster0.drwdp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // MongoDB 서버 주소 (기본 로컬)
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('forum');  // 사용하려는 데이터베이스 이름
        const collection = db.collection('post');  // 사용할 컬렉션 이름

        const data = Array.from({ length: 100 }, () => ({
            제목: faker.lorem.sentence(),
            내용: faker.lorem.paragraph(),
            비밀번호: 1234,
            재료들: [
                { 재료: faker.commerce.productName(), 갯수: `${faker.number.int({ min: 1, max: 10 })}개` },
                { 재료: faker.commerce.productName(), 갯수: `${faker.number.int({ min: 1, max: 10 })}개` },
            ],
            like: faker.number.int(100),
        }));

        await collection.insertMany(data);
        console.log('임시 데이터가 성공적으로 추가되었습니다.');
    } catch (error) {
        console.error('데이터 추가 중 오류 발생:', error);
    } finally {
        await client.close();
    }
}

insertDummyData();
