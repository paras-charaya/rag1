const express = require("express");
const searchRoutes = require("./routes/searchRoutes");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// Use session middleware
app.use(session({
    secret: 'your-secret-key',  // You can use any secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to 'true' if using HTTPS
}));

// Routes
app.use("/api", searchRoutes);

module.exports = app;
