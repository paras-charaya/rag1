const express = require("express");
const searchRoutes = require("./routes/searchRoutes");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api", searchRoutes);

module.exports = app;
