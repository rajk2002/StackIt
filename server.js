const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple test route
app.get("/", (req, res) => res.send("StackIt API is running"));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB error:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// auth
const authRoutes = require("./server/routes/auth");
app.use("/api/auth", authRoutes);

const questionRoutes = require("./server/routes/questions");
app.use("/api/questions", questionRoutes);