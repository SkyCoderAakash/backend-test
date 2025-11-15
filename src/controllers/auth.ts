import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import { generateToken } from "../utils/generateToken";
import { AuthRequest } from "../middlewares/auth";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const isExist = await User.findOne({ email });
    if (isExist) return res.status(400).json({ message: "Email exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    res.json({ message: "Registered", user });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = generateToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.json({ message: "Logged in", role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  res.json({
    message: "Profile fetched",
    user: req.user,
  });
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      status: "success",
      total: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch users",
    });
  }
};