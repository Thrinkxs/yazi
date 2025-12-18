import axios from "axios";
import AppError from "../../utils/AppError";

const API_BASE_URL = process.env.YAZI_API_BASE_URL;

/**
 * Service for user and campaign operations
 */
class UserService {
  /**
   * Fetch campaign details by ID
   * @param campaignId - The campaign ID to fetch
   * @param idToken - The ID token for authorization
   * @returns Campaign details
   */
  async getCampaignById(campaignId: string, idToken?: string) {
    try {
      const headers: any = {};
      if (idToken) {
        headers.Authorization = `Bearer ${idToken}`;
      }

      const response = await axios.get(
        `${API_BASE_URL}/campaigns/${campaignId}`,
        { headers }
      );

      return response.data;
    } catch (error: any) {
      if (error.response) {
        // API returned an error response
        const statusCode = error.response.status;
        const message = error.response.data?.message || "Failed to fetch campaign";
        throw new AppError(statusCode, message);
      } else if (error.request) {
        // Request was made but no response received
        throw new AppError(503, "Unable to reach campaign API");
      } else {
        // Something else happened
        throw new AppError(500, "Error fetching campaign details");
      }
    }
  }

  /**
   * Fetch survey graph results by campaign ID
   * @param campaignId - The campaign ID to fetch survey results for
   * @param idToken - The ID token for authorization
   * @returns Survey graph results
   */
  async getSurveyGraphResults(campaignId: string, idToken?: string) {
    try {
      const headers: any = {};
      if (idToken) {
        headers.Authorization = `Bearer ${idToken}`;
      }

      const response = await axios.get(
        `${API_BASE_URL}/campaigns/${campaignId}/survey-graph-results`,
        { headers }
      );

      return response.data;
    } catch (error: any) {
      if (error.response) {
        // API returned an error response
        const statusCode = error.response.status;
        const message = error.response.data?.message || "Failed to fetch survey graph results";
        throw new AppError(statusCode, message);
      } else if (error.request) {
        // Request was made but no response received
        throw new AppError(503, "Unable to reach campaign API");
      } else {
        // Something else happened
        throw new AppError(500, "Error fetching survey graph results");
      }
    }
  }

  /**
   * Generate PowerPoint report
   * @param reportData - The PowerPoint request data
   * @param idToken - The ID token for authorization
   * @returns PowerPoint response
   */
  async generatePowerPointReport(reportData: any, idToken?: string) {
    try {
      const headers: any = {};
      if (idToken) {
        headers.Authorization = `Bearer ${idToken}`;
      }

      const response = await axios.post(
        `${API_BASE_URL}/powerpoint-report`,
        reportData,
        { headers }
      );

      return response.data;
    } catch (error: any) {
      if (error.response) {
        const statusCode = error.response.status;
        const message = error.response.data?.message || "Failed to generate PowerPoint report";
        throw new AppError(statusCode, message);
      } else if (error.request) {
        throw new AppError(503, "Unable to reach campaign API");
      } else {
        throw new AppError(500, "Error generating PowerPoint report");
      }
    }
  }

  /**
   * Get PowerPoint report status
   * @param filename - The filename to check status for
   * @param idToken - The ID token for authorization
   * @returns PDF response
   */
  async getPowerPointStatus(filename: string, idToken?: string) {
    try {
      const headers: any = {};
      if (idToken) {
        headers.Authorization = `Bearer ${idToken}`;
      }

      const response = await axios.get(
        `${API_BASE_URL}/powerpoint-status`,
        {
          params: { filename },
          headers
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response) {
        const statusCode = error.response.status;
        const message = error.response.data?.message || "Failed to get PowerPoint status";
        throw new AppError(statusCode, message);
      } else if (error.request) {
        throw new AppError(503, "Unable to reach campaign API");
      } else {
        throw new AppError(500, "Error fetching PowerPoint status");
      }
    }
  }
}

export default new UserService();
