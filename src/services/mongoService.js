const { MongoClient } = require("mongodb");
require("dotenv").config();
const { ObjectId } = require('mongodb');

const mongoClient = new MongoClient("mongodb+srv://parascharaya1997:zB8zs7ObhPtR365P@cluster0.scz0a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
let db;

async function connectToMongo() {
  if (!db) {
    await mongoClient.connect();
    db = mongoClient.db(process.env.DB_NAME);
    console.log(`Connected to MongoDB: ${process.env.DB_NAME}`);
  }
  return db;
}

async function insertDocument(collectionName, document) {
  const db = await connectToMongo();
  const collection = db.collection(collectionName);
  return collection.insertOne(document);
}

async function findDocumentsByIds(collectionName, ids) {
  const db = await connectToMongo();
  const collection = db.collection(collectionName);

  // Convert each id in the `ids` array to ObjectId using `new ObjectId()`
  const objectIds = ids.map(id => new ObjectId(id));
  console.log("objectIds 123", objectIds)

  return collection.find({ _id: { $in: objectIds } })
    .toArray()
    .then(results => {
      // Sort results to match the order of objectIds
      results.sort((a, b) => {
        return objectIds.indexOf(a._id.toString()) - objectIds.indexOf(b._id.toString());
      });
      console.log(results);
    });
}

async function findDocuments(collectionName) {
  const db = await connectToMongo();
  const collection = db.collection(collectionName);
  return collection.find().toArray();
}

module.exports = {
  connectToMongo,
  insertDocument,
  findDocumentsByIds,
  findDocuments
};


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://parascharaya1997:zB8zs7ObhPtR365P@cluster0.scz0a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

