import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignService, CampaignDetails, SurveyGraphResults } from '../services/campaign.service';
import { AuthService } from '../services/auth.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-campaign-overview',
  imports: [CommonModule],
  templateUrl: './campaign-overview.html',
  styleUrl: './campaign-overview.css'
})
export class CampaignOverviewComponent implements OnInit {
  campaign = signal<CampaignDetails | null>(null);
  surveyResults = signal<SurveyGraphResults | null>(null);
  loading = signal(true);
  loadingResults = signal(false);
  error = signal('');
  resultsError = signal('');
  campaignId = signal('');

  constructor(
    private campaignService: CampaignService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    // Get campaign ID from route params
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.campaignId.set(id);
        this.loadCampaign(id);
      } else {
        this.error.set('No campaign ID provided');
        this.loading.set(false);
      }
    });
  }

  async loadCampaign(campaignId: string) {
    try {
      this.loading.set(true);
      this.error.set('');
      
      const data = await this.campaignService.getCampaignById(campaignId);
      this.campaign.set(data);
      
      // Load survey results after campaign details
      await this.loadSurveyResults(campaignId);
      
    } catch (error: any) {
      this.error.set(error.message || 'Failed to load campaign');
      toast.error('Failed to load campaign details');
      console.error('Campaign load error:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async loadSurveyResults(campaignId: string) {
    try {
      this.loadingResults.set(true);
      this.resultsError.set('');
      
      const results = await this.campaignService.getSurveyGraphResults(campaignId);
      this.surveyResults.set(results);
      
    } catch (error: any) {
      this.resultsError.set(error.message || 'Failed to load survey results');
      console.error('Survey results load error:', error);
    } finally {
      this.loadingResults.set(false);
    }
  }

  getDistributionEntries(distribution: Record<string, number>): Array<[string, number]> {
    return Object.entries(distribution);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
