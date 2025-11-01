import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

import { User } from "../model/user";
import { HTTP_STATUS } from "../constants/status";

dotenv.config();

// Constants
const SALT_ROUNDS = 10;
const DEFAULT_JWT_EXPIRES_IN = "1d";
const PASSWORD_RESET_EXPIRES_IN = "1h";

// Types
interface AuthRequest extends Request {
  userId?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Utility Functions
const generateToken = (userId: string, email: string): string => {
  const payload = { userId, email };
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const options: jwt.SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN || DEFAULT_JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, secret, options);
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password && password.length >= 6;
};

// Auth Controllers

/**
 * Login user with email and password
 */
export const loginUser = async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    if (!validateEmail(email)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    // Find user and validate credentials
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // Generate token and prepare response
    const token = generateToken(user._id.toString(), user.email);
    const { passwordHash, ...userData } = user.toObject();
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Login successful",
      token,
      user: userData
    });

  } catch (error: any) {
    console.error("Login error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: "Internal server error during login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Change user password
 */
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body as ChangePasswordRequest;
    const userId = req.userId;

    // Validate authentication
    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
        success: false,
        message: "Authentication required" 
      });
    }

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        success: false,
        message: "Current password and new password are required" 
      });
    }

    if (!validatePassword(newPassword)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "New password must be at least 6 characters long"
      });
    }

    // Find user and verify current password
    const user = await User.findById(userId).select('+passwordHash');
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ 
        success: false,
        message: "User not found" 
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
        success: false,
        message: "Current password is incorrect" 
      });
    }

    // Prevent using the same password
    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSamePassword) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "New password cannot be the same as current password"
      });
    }

    // Update password
    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.passwordHash = hashedNewPassword;
    await user.save();

    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: "Password updated successfully" 
    });

  } catch (error: any) {
    console.error("Change password error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: "Failed to change password",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Initiate password reset process
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        success: false,
        message: "Email is required" 
      });
    }

    if (!validateEmail(email)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    const user = await User.findOne({ email });
    
    // Always return same message for security (prevent email enumeration)
    const responseMessage = "If the email exists, a password reset link has been sent";

    if (!user) {
      return res.status(HTTP_STATUS.OK).json({ 
        success: true,
        message: responseMessage 
      });
    }

    // Generate secure reset token
    const resetToken = jwt.sign(
      { 
        userId: user._id.toString(),
        purpose: "password_reset",
        timestamp: Date.now()
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: PASSWORD_RESET_EXPIRES_IN }
    );

    // TODO: In production, implement:
    // 1. Store reset token in database with expiry
    // 2. Send email with reset link
    // 3. Use secure token generation (crypto.randomBytes)

    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: responseMessage 
    });

  } catch (error: any) {
    console.error("Forgot password error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: "Failed to process password reset request",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Verify JWT token validity and return user data
 */
export const verifyToken = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
        success: false,
        valid: false,
        message: "Invalid or missing token" 
      });
    }

    const user = await User.findById(userId).select("-passwordHash");
    
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ 
        success: false,
        valid: false,
        message: "User not found" 
      });
    }

    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      valid: true, 
      user 
    });

  } catch (error: any) {
    console.error("Token verification error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      valid: false,
      message: "Token verification failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create new user account
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, ...otherData } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    if (!validateEmail(email)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    if (!validatePassword(password)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        success: false,
        message: "Email already registered" 
      });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = new User({
      email,
      passwordHash: hashedPassword,
      ...otherData
    });
    
    await newUser.save();
    
    const { passwordHash, ...userData } = newUser.toObject();
    
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "User created successfully",
      user: userData
    });

  } catch (error: any) {
    console.error("User creation error:", error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Invalid user data",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: "Failed to create user",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};