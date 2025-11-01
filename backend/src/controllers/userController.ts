import { Request, Response } from "express";
import { IUser } from "../types/user.types";
import { User } from "../model/user";
import { HTTP_STATUS } from "../constants/status";
import jwt from "../helpers/jwt";

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Email already registered" });     

    const newUser = new User(req.body);
    await newUser.save();
    const { passwordHash, ...userData } = newUser.toObject();
    res.status(HTTP_STATUS.CREATED).json(userData);
  } catch (err: any) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Get all users with optional pagination
export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .select("-password_hash"); 

    const total = await User.countDocuments();

    res.status(HTTP_STATUS.OK).json({ total, page, limit, users });
  } catch (err: any) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password_hash");
    if (!user) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "User not found" });

    res.status(HTTP_STATUS.OK).json(user);
  } catch (err: any) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password_hash");
    if (!user) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "User not found" });

    res.status(HTTP_STATUS.OK).json(user);
  } catch (err: any) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password_hash");
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "User not found" });

    res.status(HTTP_STATUS.OK).json({ message: "User deleted successfully" });
  } catch (err: any) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Invalid email or password" });
    }

    // Check password (plain text, since no hashing)
    if (user.password_hash !== password) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" } // token valid for 7 days
    );

    // Exclude passwordHash from response
    const { passwordHash, ...userData } = user.toObject();

     res.status(HTTP_STATUS.OK).json({ user: userData, token });
  } catch (err: any) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};
