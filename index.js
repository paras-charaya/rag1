const app = require("./src/app");
const { connectToMongo } = require("./src/services/mongoService");

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectToMongo(); // Ensure MongoDB is connected
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
