import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { BusinessForecastComponent } from './business-forecast/business-forecast.component';
import { FundingsComponent } from './fundings/fundings.component';
import { BudgetComponent } from './budget/budget.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { StocksInventoryComponent } from './stocks-inventory/stocks-inventory.component';
import { BusinessPlanComponent } from './business-plan/business-plan.component';
import { LearningComponent } from './learning/learning.component';
import { AboutUsComponent } from './about-us/about-us.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forecast', component: BusinessForecastComponent},
  { path: 'fund', component: FundingsComponent},
  { path: 'budget', component: BudgetComponent},
  { path: 'notification', component: NotificationsComponent},
  { path: 'stocks', component: StocksInventoryComponent},
  { path: 'plan', component: BusinessPlanComponent},
  { path: 'learning', component: LearningComponent},
  { path: 'about', component: AboutUsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }