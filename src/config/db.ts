import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("📦 MongoDB Connected");
  } catch (error) {
    console.log("DB Error → ", error);
  }
};

export default connectDB;
