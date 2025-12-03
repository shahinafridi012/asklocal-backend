import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header) throw new Error("No authorization header");

    const token = header.split(" ")[1];
    if (!token) throw new Error("Missing token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    (req as any).user = decoded;

    next();
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      message: "Token expired or invalid — please log in again.",
    });
  }
};
