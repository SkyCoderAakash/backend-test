import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API running on Vercel" });
});

// const port = 3000;
// app.listen(port, () => {
//   console.log(`server is listenting on http://localhost:${port}`);
// });

export default app;
