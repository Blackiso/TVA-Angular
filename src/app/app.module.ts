import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ChartsModule } from 'ng2-charts';

import { FilesService } from './dashboard/services/files.service';
import { DashboardService } from './dashboard/services/dashboard.service';
import { AuthenticationService } from './services/authentication.service';
import { UserDataService } from './services/user-data.service';
import { LocalStorageService } from './services/local-storage.service';

import { AuthGuard } from './guards/auth.guard';
import { ReverseAuthGuard } from './guards/reverse-auth.guard';
import { PaymentGuard } from './guards/payment.guard';
import { UserGuard } from './guards/user-guard.guard';

import { HelperModule } from './modules/helper.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { SidebarComponent } from './dashboard/components/sidebar/sidebar.component';
import { TopbarComponent } from './dashboard/components/topbar/topbar.component';
import { FilesComponent } from './dashboard/components/files/files.component';
import { FileComponent } from './dashboard/components/files/file/file.component';
import { ClickAwayDirective } from './directives/click-away.directive';
import { UsersComponent } from './dashboard/components/users/users.component';
import { UserComponent } from './dashboard/components/users/user/user.component';
import { NavigateToDirective } from './directives/navigate-to.directive';
import { HomeComponent } from './main-pages/home/home.component';
import { LoginComponent } from './main-pages/login/login.component';
import { RegisterComponent } from './main-pages/register/register.component';
import { PageComponent } from './main-pages/page/page.component';
import { AccountInfoComponent } from './main-pages/register/steps/account-info/account-info.component';
import { VerificationComponent } from './main-pages/register/steps/verification/verification.component';
import { PlansComponent } from './main-pages/register/steps/plans/plans.component';
import { FinishComponent } from './main-pages/register/steps/finish/finish.component';
import { CompaniesComponent } from './main-pages/companies/companies.component';
import { AddComponent } from './popups/add/add.component';
import { AlertComponent } from './popups/alert/alert.component';
import { AddUserComponent } from './popups/add-user/add-user.component';
import { ScrollLoadingDirective } from './directives/scroll-loading.directive';
import { BillsComponent } from './dashboard/components/bills/bills.component';
import { AddBillsComponent } from './popups/add-bills/add-bills.component';
import { BillComponent } from './dashboard/components/bills/bill/bill.component';
import { BillsBasedComponent } from './abstract/bills-based/bills-based.component';
import { SettingsComponent } from './dashboard/components/settings/settings.component';
import { BlockClickDirective } from './directives/block-click.directive';
import { CapturePaymentComponent } from './main-pages/capture-payment/capture-payment.component';
import { AccountComponent } from './dashboard/components/settings/account/account.component';
import { PaymentsComponent } from './dashboard/components/settings/payments/payments.component';
import { TvaTableComponent } from './popups/tva-table/tva-table.component';
import { MoneyPipe } from './pipes/money.pipe';
import { OverviewComponent } from './dashboard/components/overview/overview.component';
import { DetailsComponent } from './dashboard/components/overview/details/details.component';
import { StatsComponent } from './dashboard/components/overview/stats/stats.component';
import { OverviewFilesComponent } from './dashboard/components/overview/files/files.component';
import { VerifyEmailComponent } from './popups/verify-email/verify-email.component';
import { ContactUsComponent } from './popups/contact-us/contact-us.component';
import { TooltipDirective } from './directives/tooltip.directive';
import { PasswordResetComponent } from './main-pages/password-reset/password-reset.component';
import { NotFoundComponent } from './main-pages/not-found/not-found.component';

@NgModule({
	declarations: [
    	AppComponent,
    	DashboardComponent,
    	SidebarComponent,
    	TopbarComponent,
    	FilesComponent,
    	FileComponent,
    	UsersComponent,
    	HomeComponent,
    	LoginComponent,
    	RegisterComponent,
    	PageComponent,
    	AccountInfoComponent,
    	VerificationComponent,
    	PlansComponent,
    	FinishComponent,
    	CompaniesComponent,
    	AddComponent,
    	AlertComponent,
    	UserComponent,
    	AddUserComponent,
        ScrollLoadingDirective,
        NavigateToDirective,
        ClickAwayDirective,
        BillsComponent,
        AddBillsComponent,
        BillComponent,
        SettingsComponent,
        BlockClickDirective,
        CapturePaymentComponent,
        AccountComponent,
        PaymentsComponent,
        TvaTableComponent,
        MoneyPipe,
        OverviewComponent,
        DetailsComponent,
        StatsComponent,
        OverviewFilesComponent,
        VerifyEmailComponent,
        ContactUsComponent,
        TooltipDirective,
        PasswordResetComponent,
        NotFoundComponent
  	],
  	imports: [
    	BrowserModule,
    	AppRoutingModule,
        FormsModule,
        HelperModule,
        HttpClientModule,
        NgScrollbarModule,
        ChartsModule
  	],
  	providers: [
        FilesService,
        DashboardService,
        AuthenticationService,
        UserDataService,
        AuthGuard,
        ReverseAuthGuard,
        LocalStorageService,
        PaymentGuard,
        UserGuard
    ],
	bootstrap: [AppComponent]
})
export class AppModule { }
