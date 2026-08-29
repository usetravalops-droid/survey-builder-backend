import type { NextFunction, Request, Response } from "express";
import { verifyAuthToken } from "../lib/jwt.js";
import { AuthRepository } from "../modules/auth/auth.repository.js";

const authRepository = new AuthRepository();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization header",
      });
    }

    const payload = verifyAuthToken(token);

    const user = await authRepository.findById(payload.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: "Session has expired",
      });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Email verification required",
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      version: user.tokenVersion,
    };
    console.log(req.user);
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
