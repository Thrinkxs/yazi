import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { CampaignOverviewComponent } from './campaign/campaign-overview';
import { SurveyResultsComponent } from './survey-results/survey-results';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'campaign/:id',
    component: CampaignOverviewComponent,
    canActivate: [authGuard]
  },
  {
    path: 'survey-results/:id',
    component: SurveyResultsComponent,
    canActivate: [authGuard]
  },
];
