const { MongoError } = require('mongodb');

// db.js
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`;

let dbInstance = null;
const dbName = "giftdb";

async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance
    };

    const client = new MongoClient(url);

    try {
        await client.connect();

        console.log("Connected to the database");

        dbInstance = client.db(dbName);

        if(!dbInstance){
            throw new Error('Database not initialized. Call connect first.');
            return;
        }

        console.log("dbInstance Initialized");
    } catch (err) {
        console.log("There was a problem connecting to the database" + err);
    }

    return dbInstance;
}

module.exports = connectToDatabase;
