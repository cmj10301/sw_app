// mongodbClient.js (NextAuth MongoDBAdapter용)
const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://cmj10301:kRdBu9Pd3xp9CAqL@cluster0.drwdp.mongodb.net/forum?retryWrites=true&w=majority&appName=Cluster0';

let client;
let clientPromise;

if (!global._mongoClientPromise) {
    client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

module.exports = clientPromise;
