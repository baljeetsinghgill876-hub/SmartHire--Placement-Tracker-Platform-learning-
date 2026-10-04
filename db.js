require("dotenv").config();

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

async function connectDB() {

    await client.connect();

    console.log("MongoDB connected!");

    return client.db(process.env.DB_NAME);
}

module.exports = connectDB;