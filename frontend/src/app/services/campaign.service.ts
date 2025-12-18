import { Injectable, inject } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface QuestionOption {
  id: string;
  questionId: string;
  option: string;
  order: number;
  history: any[];
}

export interface QuestionLogic {
  id: string;
  questionId: string;
  jumpTo: string;
  options: string[];
  operand: string;
  referenceQuestionKey: string;
}

export interface Question {
  id: string;
  campaignId: string;
  context: string;
  question: string;
  questionKey: string;
  note: string | null;
  type: string;
  number: number;
  other: boolean;
  multiple: boolean;
  back: boolean;
  logic: QuestionLogic[];
  options: QuestionOption[];
  media: any | null;
}

export interface CampaignDetails {
  id: string;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  starterPhrase: string;
  surveyId: number;
  organisationId: string;
  whatsappLink: string;
  objective: string;
  isFlowEnabled: boolean;
  isSandbox: boolean;
  maximumMessages: number;
  questions: {
    questions: {
      items: Question[];
    };
  };
  audience?: {
    screenerQuestions: {
      items: any[];
    };
  };
}

export interface SurveyGraphResults {
  totalParticipants: number;
  questionData: Array<{
    questionId: string;
    question: string;
    type: string;
    distribution: Record<string, number>;
    responseCount: number;
  }>;
}

export interface PowerPointRequest {
  campaignId: string;
  campaignTitle: string;
  organisationName: string;
  totalResponses: number;
  questions: Array<{
    question: string;
    content: {
      type: string;
      categories: string[];
      series: Array<{ name: string; values: number[] }>;
    };
  }>;
  metadata?: Record<string, any>;
}

export interface PowerPointResponse {
  fileName?: string;
  status?: string;
  downloadUrl?: string;
  objectKey?: string;
  success?: boolean;
}

export interface StatusResponse {
  status: string;
}

export interface PdfResponse {
  downloadUrl: string;
  status: string;
}

export type GenerateResponse = PdfResponse | StatusResponse;

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private api: AxiosInstance;
  private authService = inject(AuthService);

  constructor() {
    this.api = axios.create({
      baseURL: environment.apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Add request interceptor to automatically include Bearer token for authentication
    this.api.interceptors.request.use(
      (config) => {
        const accessToken = this.authService.getAccessToken();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get campaign details by ID
   */
  async getCampaignById(campaignId: string): Promise<CampaignDetails> {
    try {
      const response = await this.api.get(`/user/campaigns/${campaignId}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch campaign');
      }
      throw new Error('Network error. Please try again.');
    }
  }

  /**
   * Get survey graph results by campaign ID
   */
  async getSurveyGraphResults(campaignId: string): Promise<SurveyGraphResults> {
    try {
      const response = await this.api.get(`/user/campaigns/${campaignId}/survey-graph-results`);
      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch survey results');
      }
      throw new Error('Network error. Please try again.');
    }
  }

  /**
   * Generate PowerPoint report
   */
  async generatePowerPointReport(request: PowerPointRequest): Promise<PowerPointResponse> {
    try {
      const response = await this.api.post('/user/powerpoint-report', request);
      return response.data.data || response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to generate PowerPoint report');
      }
      throw new Error('Network error. Please try again.');
    }
  }

  /**
   * Get PowerPoint report status and download URL
   */
  async getPowerPointStatus(filename: string): Promise<GenerateResponse> {
    try {
      const response = await this.api.get(`/user/powerpoint-status`, {
        params: { filename }
      });
      return response.data.data || response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to check PowerPoint status');
      }
      throw new Error('Network error. Please try again.');
    }
  }
}
