import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { EventListingComponent } from './components/event-listing/event-listing.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';

/**
 * Application routing module.
 * 
 * Defines all routes for the Volunteer Event Matcher application.
 */
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'events', component: EventListingComponent },
  { path: 'event/:id', component: EventDetailComponent },
  { path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },
  { path: 'volunteer', loadChildren: () => import('./components/volunteer/volunteer.module').then(m => m.VolunteerModule) },
  { path: 'organizer', loadChildren: () => import('./components/organizer/organizer.module').then(m => m.OrganizerModule) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
