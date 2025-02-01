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
    console.log("Profiles are ", profiles);

    profiles.forEach((doc, indexId) => {
      if (doc.descriptionEmbeddings) {
        // Add to Annoy
        v.push(doc.descriptionEmbeddings);
      } else {
        console.warn(`Document ${indexId} has no descriptionEmbeddings`);
      }
    });

    const data = await buildIndex(v, 10); // 10 trees
    console.log("Annoy index built successfully ", data);

    res.status(200).json({ message: "Annoy index built successfully" });
  } catch (err) {
    console.log("ERR ", err);
    res.status(200).json({ message: "Failed" });
  }
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
