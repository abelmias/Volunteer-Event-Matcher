import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizerDashboardComponent } from './organizer-dashboard/organizer-dashboard.component';
import { EventManagementComponent } from './event-management/event-management.component';
import { ApplicationsComponent } from './applications/applications.component';

const routes: Routes = [
  { path: 'dashboard', component: OrganizerDashboardComponent },
  { path: 'events', component: EventManagementComponent },
  { path: 'applications', component: ApplicationsComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizerRoutingModule { }
