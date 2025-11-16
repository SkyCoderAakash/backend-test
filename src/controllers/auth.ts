import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middlewares/auth";
import { sendResponse } from "../utils/response";

const sendToken = (
  res: Response,
  user: any,
  statusCode = 200,
  message = ""
) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * Number(process.env.TOKEN_EXPIRES_IN),
  });

  sendResponse(res, {
    success: true,
    message,
    data: user,
    statusCode,
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const exist = await User.findOne({ email });
    if (exist) {
      return sendResponse(res, {
        success: false,
        message: "Email already exists",
        statusCode: 400,
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    sendToken(res, user, 201, "Registered successfully");
  } catch (err) {
    sendResponse(res, {
      success: false,
      message: "Registration failed",
      errors: err,
      statusCode: 500,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, {
        success: false,
        message: "Invalid credentials",
        statusCode: 400,
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return sendResponse(res, {
        success: false,
        message: "Invalid credentials",
        statusCode: 400,
      });
    }

    sendToken(res, user, 200, "Logged in successfully");
  } catch (err) {
    sendResponse(res, {
      success: false,
      message: "Login failed",
      errors: err,
      statusCode: 500,
    });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  sendResponse(res, { success: true, message: "Logged out successfully" });
};

export const me = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return sendResponse(res, {
      success: false,
      message: "Not authenticated",
      statusCode: 401,
    });
  }

  sendResponse(res, {
    success: true,
    message: "Profile fetched",
    data: req.user,
  });
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    sendResponse(res, {
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    sendResponse(res, {
      success: false,
      message: "Failed to fetch users",
      errors: error,
      statusCode: 500,
    });
  }
};
