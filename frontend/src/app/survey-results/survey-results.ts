import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignService, SurveyGraphResults, CampaignDetails, PowerPointRequest } from '../services/campaign.service';
import { AuthService } from '../services/auth.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-survey-results',
  imports: [CommonModule],
  templateUrl: './survey-results.html',
  styleUrl: './survey-results.css'
})
export class SurveyResultsComponent implements OnInit {
  surveyResults = signal<SurveyGraphResults | null>(null);
  campaign = signal<CampaignDetails | null>(null);
  loading = signal(true);
  error = signal('');
  campaignId = signal('');
  generatingPowerPoint = signal(false);
  checkingStatus = signal(false);
  downloadUrl = signal<string | null>(null);
  powerPointFileName = signal<string | null>(null);

  constructor(
    private campaignService: CampaignService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.campaignId.set(id);
        this.loadSurveyResults(id);
      } else {
        this.error.set('No campaign ID provided');
        this.loading.set(false);
      }
    });
  }

  async loadSurveyResults(campaignId: string) {
    try {
      this.loading.set(true);
      this.error.set('');
      
      // Load both campaign details and survey results
      const [campaignData, results] = await Promise.all([
        this.campaignService.getCampaignById(campaignId),
        this.campaignService.getSurveyGraphResults(campaignId)
      ]);
      
      this.campaign.set(campaignData);
      this.surveyResults.set(results);
      
    } catch (error: any) {
      this.error.set(error.message || 'Failed to load survey results');
      toast.error('Failed to load survey results');
      console.error('Survey results load error:', error);
    } finally {
      this.loading.set(false);
    }
  }

  getDistributionEntries(distribution: Record<string, number>): Array<[string, number]> {
    return Object.entries(distribution);
  }

  async generatePowerPoint() {
    const campaign = this.campaign();
    const results = this.surveyResults();

    if (!campaign || !results) {
      toast.error('Campaign data not loaded');
      return;
    }

    try {
      this.generatingPowerPoint.set(true);

      // Transform survey results into PowerPoint request format
      const questions = results.questionData.map(qData => {
        const categories = Object.keys(qData.distribution);
        const values = Object.values(qData.distribution);

        return {
          question: qData.question,
          content: {
            type: 'bar',
            categories: categories,
            series: [{
              name: 'Responses',
              values: values
            }]
          }
        };
      });

      const request: PowerPointRequest = {
        campaignId: campaign.id,
        campaignTitle: campaign.title,
        organisationName: 'Your Organization',
        totalResponses: results.totalParticipants,
        questions: questions,
        metadata: {
          generatedAt: new Date().toISOString(),
          campaignType: campaign.type,
          campaignStatus: campaign.status
        }
      };

      const response = await this.campaignService.generatePowerPointReport(request);
      
      // Check if download URL is already available (synchronous generation)
      if ('downloadUrl' in response && response.downloadUrl) {
        this.downloadUrl.set(response.downloadUrl);
        toast.success('Report is ready for download!');
      } else if (response.fileName) {
        // Asynchronous generation - poll for status
        this.powerPointFileName.set(response.fileName);
        toast.success('PowerPoint report generation started');
        await this.checkPowerPointStatus(response.fileName);
      } else {
        toast.error('Unexpected response from server');
      }

    } catch (error: any) {
      toast.error(error.message || 'Failed to generate PowerPoint report');
      console.error('PowerPoint generation error:', error);
    } finally {
      this.generatingPowerPoint.set(false);
    }
  }

  async checkPowerPointStatus(filename: string) {
    try {
      this.checkingStatus.set(true);
      
      const response = await this.campaignService.getPowerPointStatus(filename);
      
      if ('downloadUrl' in response) {
        // PDF is ready
        this.downloadUrl.set(response.downloadUrl);
        toast.success('Report is ready for download!');
      } else {
        // Still processing
        toast.info(`Report status: ${response.status}`);
        
        // Poll again after 3 seconds if still processing
        if (response.status === 'processing' || response.status === 'pending') {
          setTimeout(() => {
            if (this.powerPointFileName()) {
              this.checkPowerPointStatus(filename);
            }
          }, 3000);
        }
      }
      
    } catch (error: any) {
      console.error('Status check error:', error);
      toast.error('Failed to check report status');
    } finally {
      this.checkingStatus.set(false);
    }
  }

  downloadReport() {
    const url = this.downloadUrl();
    if (!url) {
      toast.error('Download URL not available');
      return;
    }

    // Open download URL in new tab
    window.open(url, '_blank');
    toast.success('Download started!');
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  goBack() {
    this.router.navigate([`/campaign/${this.campaignId()}`]);
  }
}
