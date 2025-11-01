import { Request, Response } from "express";
import { User } from "../model/user";
import { HTTP_STATUS } from "../constants/status";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
      balance,
      subscriptionStatus,
      isKYCVerified,
      idType,
      idNumber,
      licensePhoto,
      livePhoto,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(HTTP_STATUS.CONFLICT).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      name,
      email,
      passwordHash: password, 
      phone,
      role,
      balance,
      subscriptionStatus,
      isKYCVerified,
      idType,
      idNumber,
      licensePhoto,
      livePhoto,
    });

    return res.status(HTTP_STATUS.CREATED).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        balance: newUser.balance,
        subscriptionStatus: newUser.subscriptionStatus,
        isKYCVerified: newUser.isKYCVerified,
        idType: newUser.idType,
        idNumber: newUser.idNumber,
        licensePhoto: newUser.licensePhoto,
        livePhoto: newUser.livePhoto,
      },
    });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server error", error: error instanceof Error ? error.message : String(error) });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "User not found" });
    }

    
    if (password !== user.passwordHash) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.status(HTTP_STATUS.OK).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        balance: user.balance,
        subscriptionStatus: user.subscriptionStatus,
        isKYCVerified: user.isKYCVerified,
        idType: user.idType,
        idNumber: user.idNumber,
        licensePhoto: user.licensePhoto,
        livePhoto: user.livePhoto,
      },
    });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server error", error: error instanceof Error ? error.message : String(error) });
  }
};

// Get profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "User not authenticated" });
    }

    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "User not found" });
    }

    return res.status(HTTP_STATUS.OK).json(user);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Server error",
      error: (error as Error).message,
    });
  }
};

// Update profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const updates = req.body;

    // Hash password if it's being updated
    if (updates.password) {
      updates.passwordHash = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-passwordHash");

    if (!updatedUser) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "User not found" });
    }

    return res.status(HTTP_STATUS.OK).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server error", error });
  }
};
