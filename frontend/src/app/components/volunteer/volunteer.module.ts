import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { VolunteerRoutingModule } from './volunteer-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { SubmitEventComponent } from './submit-event/submit-event.component';

/**
 * Volunteer Module
 * 
 * Handles volunteer-specific features including event discovery and applications.
 * Uses lazy loading for better performance.
 */
@NgModule({
  declarations: [
    DashboardComponent,
    EventListComponent,
    EventDetailComponent,
    ProfileComponent,
    SubmitEventComponent
  ],
  imports: [
    CommonModule,
    VolunteerRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class VolunteerModule { }
