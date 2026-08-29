import { comparePassword, hashPassword } from "../../lib/bcrypt.js";
import { generateAuthToken, generateEmailVerificationToken, verifyEmailVerificationToken } from "../../lib/jwt.js";
import { sendVerificationEmail } from "../../lib/mail.js";
import { AuthRepository } from "./auth.repository.js";

const authRepository = new AuthRepository();

export class AuthService {
  async register(email: string, password: string) {
    const existingUser =
      await authRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const passwordHash = await hashPassword(password);

    const user = await authRepository.createUser(
      email,
      passwordHash,
    );

    const verificationToken =
      generateEmailVerificationToken(
        user.id,
        user.tokenVersion,
      );

    await sendVerificationEmail(
      user.email,
      verificationToken,
    );

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
    };
  }

  async login(email: string, password: string) {
    const user =
      await authRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordValid =
      await comparePassword(
        password,
        user.passwordHash,
      );

    if (!passwordValid) {
      throw new Error("Invalid email or password");
    }

    if (!user.emailVerified) {
      throw new Error(
        "Please verify your email before logging in",
      );
    }

    const token = generateAuthToken(
      user.id,
      user.tokenVersion,
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
      },
    };
  }

  async verifyEmail(token: string) {
    let payload;

    try {
      payload =
        verifyEmailVerificationToken(token);
    } catch {
      throw new Error(
        "Invalid or expired verification token",
      );
    }

    if (payload.purpose !== "email-verification") {
      throw new Error(
        "Invalid verification token",
      );
    }

    const user =
      await authRepository.findById(
        payload.userId,
      );

    if (!user) {
      throw new Error("User not found");
    }

    if (user.emailVerified) {
      return {
        message: "Email is already verified",
      };
    }

    if (
      user.tokenVersion !==
      payload.emailVerificationVersion
    ) {
      throw new Error(
        "Verification token is no longer valid",
      );
    }

    await authRepository.verifyEmail(user.id);

    return {
      message: "Email verified successfully",
    };
  }

  async resendVerification(email: string) {
    const user =
      await authRepository.findByEmail(email);

    if (!user) {
      return {
        message:
          "If the account exists, a verification email has been sent",
      };
    }

    if (user.emailVerified) {
      throw new Error("Email is already verified");
    }

    const updatedUser =
      await authRepository.updateVersion(
        user.id,
      );

    const verificationToken =
      generateEmailVerificationToken(
        updatedUser.id,
        updatedUser.tokenVersion,
      );

    await sendVerificationEmail(
      updatedUser.email,
      verificationToken,
    );

    return {
      message:
        "If the account exists, a verification email has been sent",
    };
  }

  async logout(userId: string) {
    await authRepository.updateVersion(userId);

    return {
      message: "Logged out successfully",
    };
  }

  async getCurrentUser(userId: string) {
    const user =
      await authRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
    };
  }
}