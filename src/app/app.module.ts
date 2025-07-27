import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { BusinessForecastComponent } from './business-forecast/business-forecast.component';
import { StocksInventoryComponent } from './stocks-inventory/stocks-inventory.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { FundingsComponent } from './fundings/fundings.component';
import { BudgetComponent } from './budget/budget.component';
import { BusinessPlanComponent } from './business-plan/business-plan.component';
import { LearningComponent } from './learning/learning.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { TabsComponent } from './tabs/tabs.component';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SignupComponent,
    SidebarComponent,
    BusinessForecastComponent,
    StocksInventoryComponent,
    NotificationsComponent,
    FundingsComponent,
    BudgetComponent,
    BusinessPlanComponent,
    LearningComponent,
    AboutUsComponent,
    TabsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AgGridModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
