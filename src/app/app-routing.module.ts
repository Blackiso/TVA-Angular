import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './main-pages/home/home.component';
import { LoginComponent } from './main-pages/login/login.component';
import { RegisterComponent } from './main-pages/register/register.component';
import { PageComponent } from './main-pages/page/page.component';
import { CompaniesComponent } from './main-pages/companies/companies.component';
import { CapturePaymentComponent } from './main-pages/capture-payment/capture-payment.component';
import { PasswordResetComponent } from './main-pages/password-reset/password-reset.component';
import { NotFoundComponent } from './main-pages/not-found/not-found.component';

import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { FilesComponent } from './dashboard/components/files/files.component';
import { UsersComponent } from './dashboard/components/users/users.component';
import { BillsComponent } from './dashboard/components/bills/bills.component';
import { SettingsComponent } from './dashboard/components/settings/settings.component';
import { OverviewComponent } from './dashboard/components/overview/overview.component';

import { AuthGuard } from './guards/auth.guard';
import { ReverseAuthGuard } from './guards/reverse-auth.guard';
import { PaymentGuard } from './guards/payment.guard';
import { UserGuard } from './guards/user-guard.guard';

const routes: Routes = [
	{
		path : '',
		component : HomeComponent,
		canActivate : [ReverseAuthGuard]
	},
	{
		path : 'home',
		component : HomeComponent,
		canActivate : [ReverseAuthGuard]
	},
	{
		path : 'login',
		component : LoginComponent,
		canActivate : [ReverseAuthGuard]
	},
	{
		path : 'register',
		component : RegisterComponent,
		canActivate : [PaymentGuard]
	},
	{
		path : 'page',
		component : PageComponent,
		canActivate : [AuthGuard]
	},
	{
		path : 'capture-payment',
		component : CapturePaymentComponent
	},
	{
		path : 'companies',
		component : CompaniesComponent,
		canActivate : [AuthGuard]
	},
	{
		path : 'reset',
		component : PasswordResetComponent,
		canActivate : [ReverseAuthGuard]
	},
	{
		path : 'dashboard',
		component : DashboardComponent,
		children : [
			{
				path : '',
				component : OverviewComponent
			},
			{
				path : 'overview',
				component : OverviewComponent
			},
			{
				path : 'files',
				component : FilesComponent
			},
			{
				path : 'users',
				component : UsersComponent,
				canActivate : [UserGuard]
			},
			{
				path : 'bills/:file/:month',
				component : BillsComponent
			},
			{
				path : 'settings',
				component : SettingsComponent,
				canActivate : [UserGuard]
			}
		],
		canActivate : [AuthGuard]
	},
	{
		path: '404', 
		component: NotFoundComponent
	},
	{
		path: '**',
		redirectTo: '/404'
	}
];

@NgModule({
 	imports: [RouterModule.forRoot(routes)],
 	exports: [RouterModule]
})
export class AppRoutingModule {}
