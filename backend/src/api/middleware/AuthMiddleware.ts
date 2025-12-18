import { Request, Response, NextFunction } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import AppError from "../../utils/AppError";

// Create verifier for access tokens
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  tokenUse: "access",
  clientId: process.env.COGNITO_CLIENT_ID!,
});

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to authenticate requests using Cognito JWT tokens
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies["access-token"];

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      throw new AppError(401, "Access token is required");
    }

    // Verify token with Cognito
    const payload = await verifier.verify(token);

    // Attach user info to request
    req.user = {
      sub: payload.sub,
      username: payload.username,
      email: payload.email,
      tokenUse: payload.token_use,
      idToken: req.cookies["id-token"] || null, // Store ID token for external API calls
    };

    next();
  } catch (error: any) {
    if (error.name === "JwtExpiredError") {
      return next(new AppError(401, "Token has expired"));
    }
    if (error.name === "JwtInvalidSignatureError") {
      return next(new AppError(401, "Invalid token signature"));
    }
    return next(new AppError(401, "Invalid or expired token"));
  }
};
