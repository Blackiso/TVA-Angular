import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './main-pages/home/home.component';
import { LoginComponent } from './main-pages/login/login.component';
import { RegisterComponent } from './main-pages/register/register.component';
import { PageComponent } from './main-pages/page/page.component';
import { CompaniesComponent } from './main-pages/companies/companies.component';

import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { FilesComponent } from './dashboard/components/files/files.component';
import { UsersComponent } from './dashboard/components/users/users.component';
import { BillsComponent } from './dashboard/components/bills/bills.component';

import { AuthGuard } from './guards/auth.guard';
import { ReverseAuthGuard } from './guards/reverse-auth.guard';

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
		canActivate : [ReverseAuthGuard]
	},
	{
		path : 'page',
		component : PageComponent,
		canActivate : [AuthGuard]
	},
	{
		path : 'companies',
		component : CompaniesComponent,
		canActivate : [AuthGuard]
	},
	{
		path : 'dashboard',
		component : DashboardComponent,
		children : [
			{
				'path' : '',
				'component' : FilesComponent
			},
			{
				'path' : 'files',
				'component' : FilesComponent
			},
			{
				'path' : 'users',
				'component' : UsersComponent
			},
			{
				'path' : 'bills/:file/:month',
				'component' : BillsComponent
			}
		],
		canActivate : [AuthGuard]
	}
];

@NgModule({
 	imports: [RouterModule.forRoot(routes)],
 	exports: [RouterModule]
})
export class AppRoutingModule {}
