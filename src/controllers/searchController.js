const { addVectorToIndex, buildIndex, getNearestNeighbors } = require("../services/annoyService");
const { insertDocument, findDocumentsByIds } = require("../services/mongoService");

async function health(req, res) {
  console.log("Node server running");
  res.status(201).json({ message: "Node server is up" });
}

async function addDocument(req, res) {
  const { id, title, vector } = req.body;

  // Add to MongoDB
  await insertDocument("documents", { id, title, vector });

  // Add to Annoy
  addVectorToIndex(id, vector);

  res.status(201).json({ message: "Document added successfully" });
}

function buildAnnoyIndex(req, res) {
  buildIndex(10); // 10 trees
  res.status(200).json({ message: "Annoy index built successfully" });
}

async function searchDocuments(req, res) {
  const { queryVector, n } = req.body;

  // Get nearest neighbors
  const { neighbors } = getNearestNeighbors(queryVector, n);

  // Retrieve documents from MongoDB
  const results = await findDocumentsByIds("documents", neighbors);

  res.status(200).json({ neighbors, results });
}

module.exports = { addDocument, buildAnnoyIndex, health, searchDocuments };
