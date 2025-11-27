import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { SubmitEventComponent } from './submit-event/submit-event.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'submit-event', component: SubmitEventComponent },
  { path: 'events', component: EventListComponent },
  { path: 'events/:id', component: EventDetailComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VolunteerRoutingModule { }
