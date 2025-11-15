import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import authRoutes from './routes/auth'
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

connectDB();

app.get("/", (req, res) => {
  res.json({ status: "success", message: "Hello from server" });
});


app.use("/api/auth", authRoutes);

export default app;
