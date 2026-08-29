import type { Request, Response } from "express";
import { AuthService } from "./auth.services.js";


const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await authService.register(
      email,
      password,
    );

    return res.status(201).json({
      message:
        "Account created successfully. Please verify your email.",
      data: user,
    });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const result = await authService.login(
      email,
      password,
    );

    return res.status(200).json({
      token: result.token,
    });
  }

  async verifyEmail(req: Request, res: Response) {
    const { token } = req.query;

    const result = await authService.verifyEmail(
      token as string,
    );

    return res.status(200).json({
      message: result.message,
    });
  }

  async resendVerification(
    req: Request,
    res: Response,
  ) {
    const { email } = req.body;

    const result =
      await authService.resendVerification(email);

    return res.status(200).json({
      message: result.message,
    });
  }

  async logout(req: Request, res: Response) {
    const userId = req.user.id;

    const result =
      await authService.logout(userId);

    return res.status(200).json({
      message: result.message,
    });
  }

}

export const authController =
  new AuthController();