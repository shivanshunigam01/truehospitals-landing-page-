const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const leadRoutes = require("./routes/leadRoutes");
const adminRoutes = require("./routes/adminRoutes");
const registerDefaultAdmin = require("./utils/registerAdmin"); // ✅ import helper

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Allow all origins
app.use(
  cors({
    origin: "*", // ✅ Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // ✅ Allow common methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow common headers
  })
);
// Root route
app.get("/", (req, res) => res.send("Backend running successfully!"));

// API routes
app.use("/api/leads", leadRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { dbName: "true_hospitals" })
  .then(async () => {
    console.log("✅ MongoDB Connected");
    await registerDefaultAdmin(); // ✅ create admin automatically
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
