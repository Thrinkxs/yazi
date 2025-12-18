import { Request, Response, NextFunction } from "express";
import UserService from "../services/user.service";
import AppError from "../../utils/AppError";

/**
 * Get campaign details by ID
 */
export const getCampaignById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { campaignId } = req.params;

    if (!campaignId) {
      throw new AppError(400, "Campaign ID is required");
    }

    const campaign = await UserService.getCampaignById(campaignId);

    res.status(200).json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get survey graph results by campaign ID
 */
export const getSurveyGraphResults = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { campaignId } = req.params;

    if (!campaignId) {
      throw new AppError(400, "Campaign ID is required");
    }

    const results = await UserService.getSurveyGraphResults(campaignId);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate PowerPoint report
 */
export const generatePowerPointReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reportData = req.body;

    if (!reportData) {
      throw new AppError(400, "Report data is required");
    }

    const result = await UserService.generatePowerPointReport(reportData);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get PowerPoint report status
 */
export const getPowerPointStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { filename } = req.query;

    if (!filename || typeof filename !== "string") {
      throw new AppError(400, "Filename query parameter is required");
    }

    const result = await UserService.getPowerPointStatus(filename);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
