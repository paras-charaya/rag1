const { buildIndex, getNearestNeighbors } = require("../services/annoyService");
const { insertDocument, findDocumentsByIds, findDocuments } = require("../services/mongoService");

const { generateEmbedding } = require("../services/openaiService");

async function health(req, res) {
  console.log("Node server running");
  res.status(201).json({ message: "Node server is up" });
}

async function addDocument(req, res) {
  console.log("In AddDocument", req.body);

  const { name, email, skillsDescription } = req.body;

  // Add to MongoDB
  const descriptionEmbeddings = await generateEmbedding(skillsDescription);
  await insertDocument("documents", { name, email, skillsDescription, descriptionEmbeddings });

  res.status(201).json({ message: "Document added successfully" });
}

async function buildAnnoyIndex(req, res) {
  try {
    const profiles = await findDocuments("documents");
    let v = [];
    let documentIds = [];  // This will store the MongoDB _id values in the same order as vectors

    profiles.forEach((doc, indexId) => {
      if (doc.descriptionEmbeddings) {
        // Add vector to Annoy index
        v.push(doc.descriptionEmbeddings);
        // Store MongoDB _id in the same order as vectors
        documentIds.push(doc._id.toString()); // Use _id for MongoDB document ID
      } else {
        console.warn(`Document ${indexId} has no descriptionEmbeddings`);
      }
    });

    // Store the mapping somewhere (in memory, or a file, or a database)
    // You can either store it in memory or in a persistent store. For simplicity, I'll keep it in memory.
    req.session.documentIds = documentIds;  // Store the documentIds in the session

    const data = await buildIndex(v, 10); // 10 trees
    console.log("Annoy index built successfully ", data);

    res.status(200).json({ message: "Annoy index built successfully" });
  } catch (err) {
    console.log("ERR ", err);
    res.status(200).json({ message: "Failed" });
  }
}


async function searchDocuments(req, res) {
  try {
    const { query } = req.body;
    const dims = 1536; // Set the correct number of dimensions
    const numNeighbors = 5; // Number of nearest neighbors to find
  
    const queryVector = await generateEmbedding(query);
  
    // Get nearest neighbors
    const neighbors = await getNearestNeighbors(queryVector, numNeighbors, dims);
  
    console.log("neighbors ", neighbors);
  
    // Get the MongoDB _id mapping from the session
    const documentIds = req.session.documentIds;

    if (documentIds) {
      // Map the neighbors' indices to the MongoDB _id values
      const neighborIds = neighbors.map(index => documentIds[index]);

      // Retrieve documents from MongoDB using the mapped _ids
      const results = await findDocumentsByIds("documents", neighborIds);

      res.status(200).json({ neighbors, results });
    } else {
      res.status(404).json({ message: "Document IDs mapping not found!" });
    }
  } catch (errr) {
    console.log("Error 123123123 ", errr);
    res.status(500).json({ message: "Server error" });
  }
}



module.exports = { addDocument, buildAnnoyIndex, health, searchDocuments };
