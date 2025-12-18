import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/Auth.Service";

const authService = new AuthService();

/**
 * Login user
 */
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const response = await authService.login(email, password);

    // Set tokens in httpOnly cookies
    res.cookie("access-token", response.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: (response.expiresIn || 3600) * 1000,
    });

    res.cookie("refresh-token", response.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "Login successful",
      data: {
        accessToken: response.accessToken,
        idToken: response.idToken,
        expiresIn: response.expiresIn,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Logout user
 */
export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Clear cookies
    res.clearCookie("access-token");
    res.clearCookie("refresh-token");

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error: any) {
    next(error);
  }
};
