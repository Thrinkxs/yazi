import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from '../../environments/environment';

export interface CampaignDetails {
  id: string;
  title: string;
  type: string;
  status: string;
  questions: {
    questions: {
      items: Array<{
        id: string;
        question: string;
        type: string;
        options?: string[];
      }>;
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

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: environment.apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
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
}
