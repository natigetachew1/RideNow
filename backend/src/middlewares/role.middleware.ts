import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { HTTP_STATUS } from "../constants/status";

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Access denied. Admins only." });
  }
  next();
};
