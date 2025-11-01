import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../model/user";
import { HTTP_STATUS } from "../constants/status";

interface JwtPayload {
  userId: string;
}

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "your_jwt_secret";

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.userId = decoded.userId;

    const user = await User.findById(req.userId);
    if (!user) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized: User not found" });

    next();
  } catch (err: any) {
    console.error(err);
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized: Invalid token" });
  }
};
