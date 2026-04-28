const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const { readCsvAsJson } = require("./utils/csvParser");

dotenv.config();

const app = express();

/***************** DB connection ***************/
const dbLink = process.env.MONGO_URI || "mongodb://localhost:27017/admin";

mongoose.connect(dbLink)
  .then(() => console.log("✅ Connected to DB"))
  .catch(err => console.error("❌ DB Connection Error:", err));

/*******************************************/
// CORS (local dev vs prod)
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:8080"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());

/************** Routes ************/
const authRouter = require("./router/authRouter.js");
const userRouter = require("./router/userRouter.js");
const chatbotRouter = require("./api/chatbot.js");

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatbotRouter);

/************** Mandi Prices route ************/
app.get("/api/mandi-prices", async (req, res) => {
  try {
    const data = readCsvAsJson(
      path.join(__dirname, "9ef84268-d588-465a-a308-a864a43d0070.csv")
    );

    res.json(data);
  } catch (error) {
    console.error("Error fetching mandi prices:", error.message);
    res.status(500).json({ error: "Failed to fetch mandi prices" });
  }
});

/*******************************************/
// ✅ Serve frontend build in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../Frontend/dist");
  app.use(express.static(frontendPath));

  // ✅ Express v4 catch-all
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}





/*******************************************/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
