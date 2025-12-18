import jwt, { sign, verify } from "jsonwebtoken";
import AppError from "./AppError";

export const generateToken = (payload: any) => {
  const pass = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_DURATION as any;
  return jwt.sign(payload, pass, {
    expiresIn,
  });
};

export const verifyToken = (token: string) => {
  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = verify(token, secret);
    return decoded;
  } catch (error: any) {
    throw new AppError(400, "Invalid Access Token!");
  }
};

export const generateRefreshToken = (payload: any) => {
  const pass = process.env.JWT_SECRET_REFRESH as string;
  const expiresIn = process.env.JWT_REFRESH_DURATION as any;
  return jwt.sign(payload, pass, {
    expiresIn,
  });
};

export const verifyRefreshToken = (token: string) => {
  try {
    const refreshSecret = process.env.JWT_SECRET_REFRESH!;
    const decoded = verify(token, refreshSecret);
    return decoded;
  } catch (error: any) {
    throw new AppError(400, "Invalid Refresh Token!");
  }
};
