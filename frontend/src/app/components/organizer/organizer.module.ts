import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { OrganizerRoutingModule } from './organizer-routing.module';
import { OrganizerDashboardComponent } from './organizer-dashboard/organizer-dashboard.component';
import { EventManagementComponent } from './event-management/event-management.component';
import { ApplicationsComponent } from './applications/applications.component';

/**
 * Organizer Module
 * 
 * Handles organizer-specific features including event creation and volunteer management.
 * Uses lazy loading for better performance.
 */
@NgModule({
  declarations: [
    OrganizerDashboardComponent,
    EventManagementComponent,
    ApplicationsComponent
  ],
  imports: [
    CommonModule,
    OrganizerRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class OrganizerModule { }
