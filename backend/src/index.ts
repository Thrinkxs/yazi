import express, { json, NextFunction, urlencoded } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import { dbconfig } from "../src/config/dbconfig";

import { Request, Response } from "express";

import cookieParser from "cookie-parser";
import AppError from "./utils/AppError";

import authRoute from "./api/routes/auth.route";
import userRoute from "./api/routes/user.route";
import { KeepRenderAwake } from "./utils/KeepRenderAwake";


// dotenv.config();

const app = express();

const port = process.env.PORT || 3001;
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4200",
  "https://api-dev.askyazi.co",
  "https://yazi-r9qu.onrender.com",
  "https://yazi-seven.vercel.app"
  
];
const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

//Connect to MongoDB
mongoose
  .connect(dbconfig.mongo.url, { retryWrites: true, w: "majority" })
  .then(() => {
    console.log("Connected to MongoDB database!");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB: ", error);
  });

KeepRenderAwake();

app.get("/", (req: Request, res: Response) => {
  res.send("Express server is running on Render Cloud");
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.use("/api/*", (req: Request, res: Response, next: NextFunction) => {
  throw new AppError(404, "API route not found");
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
  } else {
    res.status(500).json({
      meesage: "Internal Server Error",
      details: error.message,
    });
  }
});

//Server
app.listen(port, () => {
  console.log("Server running on port ", port);
});
