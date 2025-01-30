// import OpenAI from "openai";
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "", // Replace with your OpenAI API Key
});

async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002", // Recommended embedding model
      input: text,
    });

    console.log("Embedding:", response.data[0].embedding);
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = {
    generateEmbedding
  };
