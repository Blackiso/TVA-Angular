import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { FilesService } from './dashboard/services/files.service';
import { DashboardService } from './dashboard/services/dashboard.service';
import { AuthenticationService } from './services/authentication.service';
import { UserDataService } from './services/user-data.service';
import { LocalStorageService } from './services/local-storage.service';

import { AuthGuard } from './guards/auth.guard';
import { ReverseAuthGuard } from './guards/reverse-auth.guard';

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
        BillComponent
  	],
  	imports: [
    	BrowserModule,
    	AppRoutingModule,
        FormsModule,
        HelperModule,
        HttpClientModule,
        NgScrollbarModule
  	],
  	providers: [
        FilesService,
        DashboardService,
        AuthenticationService,
        UserDataService,
        AuthGuard,
        ReverseAuthGuard,
        LocalStorageService
    ],
	bootstrap: [AppComponent]
})
export class AppModule { }
