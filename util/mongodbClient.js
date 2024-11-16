// mongodbClient.js
const { MongoClient } = require('mongodb');
const url = process.env.MONGODB_URI;

let client;
let clientPromise;

if (!global._mongoClientPromise) {
    try {
        client = new MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        global._mongoClientPromise = client.connect();
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}
clientPromise = global._mongoClientPromise;

module.exports = clientPromise;
