const express = require("express");
const { addDocument, buildAnnoyIndex, health, searchDocuments } = require("../controllers/searchController");

const router = express.Router();

router.get("/health", health);           // Add a document
router.post("/build-index", buildAnnoyIndex); // Build Annoy index
router.post("/search", searchDocuments);     // Search documents

module.exports = router;
