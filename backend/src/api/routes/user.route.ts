import { Router } from "express";
import { 
  getCampaignById, 
  getSurveyGraphResults,
  generatePowerPointReport,
  getPowerPointStatus
} from "../controller/user.controller";
import { authenticateToken } from "../middleware/AuthMiddleware";

const router = Router();

/**
 * @route   GET /api/user/campaigns/:campaignId
 * @desc    Get campaign details by ID
 * @access  Protected
 */
router.get("/campaigns/:campaignId", authenticateToken, getCampaignById);

/**
 * @route   GET /api/user/campaigns/:campaignId/survey-graph-results
 * @desc    Get survey graph results by campaign ID
 * @access  Protected
 */
router.get("/campaigns/:campaignId/survey-graph-results", authenticateToken, getSurveyGraphResults);

/**
 * @route   POST /api/user/powerpoint-report
 * @desc    Generate PowerPoint report
 * @access  Protected
 */
router.post("/powerpoint-report", authenticateToken, generatePowerPointReport);

/**
 * @route   GET /api/user/powerpoint-status
 * @desc    Get PowerPoint report status
 * @access  Protected
 */
router.get("/powerpoint-status", authenticateToken, getPowerPointStatus);

export default router;
