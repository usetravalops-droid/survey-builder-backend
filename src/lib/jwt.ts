import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SCETET!;

interface AuthTokenPayload {
  userId: string;
  tokenVersion: number;
}

interface EmailVerificationTokenPayload {
  userId: string;
  emailVerificationVersion: number;
  purpose: "email-verification";
}

export const generateAuthToken = (
  userId: string,
  tokenVersion: number,
) => {
  return jwt.sign(
    {
      userId,
      tokenVersion,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

export const generateEmailVerificationToken = (
  userId: string,
  emailVerificationVersion: number,
) => {
  return jwt.sign(
    {
      userId,
      emailVerificationVersion,
      purpose: "email-verification",
    },
    JWT_SECRET,
    {
      expiresIn: "24h",
    },
  );
};

export const verifyAuthToken = (token: string) => {
  return jwt.verify(
    token,
    JWT_SECRET,
  ) as AuthTokenPayload;
};

export const verifyEmailVerificationToken = (token: string) => {
  return jwt.verify(
    token,
    JWT_SECRET,
  ) as EmailVerificationTokenPayload;
};