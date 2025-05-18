const express = require("express");
const app = express();
const allroutes = require("./routes/AllRoutes");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
// Increase JSON payload size limit to 50MB
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const corsOptions = {
  origin: [
    "https://wealthwisee.vercel.app",
    "https://wealthwisee.live",
    "https://www.wealthwisee.live",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

app.use(cors(corsOptions));

const validateOrigin = (req, res, next) => {
  const allowedOrigins = [
    "https://wealthwisee.vercel.app",
    "https://wealthwisee.live",
    "https://www.wealthwisee.live",
    "http://localhost:3000",
  ];
  // Skip origin check if no origin header (like for direct API calls)
  if (!req.headers.origin || allowedOrigins.includes(req.headers.origin)) {
    return next();
  }
  return res.status(403).json({ error: "Unauthorized request" });
};

const authenticateToken = (req, res, next) => {
  // Public routes that don't require authentication
  const publicRoutes = [
    "/api/login",
    "/api/findmail",
    "/api/signup",
    "/api/nifty",
  ];

  // Check if the path starts with any of these prefixes
  const developmentRoutes = ["/api/stock/", "/api/portfolio"];

  // Allow public routes without authentication
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  // For development, allow stock trading routes without authentication
  // In production, you should remove this condition
  if (developmentRoutes.some((route) => req.path.startsWith(route))) {
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).send("Token required");

  jwt.verify(token, process.env.TOKEN, (err, user) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user;
    next();
  });
};

app.use(validateOrigin);
app.use(authenticateToken);

const db = async () => {
  try {
    await mongoose.connect(process.env.DBURI);
    console.log("Connected to database");
  } catch (err) {
    console.log("Error connecting to database");
  }
};
db();

app.use("/api", allroutes);

app.listen(5001, () => {
  console.log("Backend server listening at port 5001");
});
