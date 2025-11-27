import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { NotificationCenterComponent } from './components/notifications/notification-center.component';
import { EventListingComponent } from './components/event-listing/event-listing.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { CommonModule } from '@angular/common';

/**
 * Root module for the Volunteer Event Matcher application.
 * 
 * This module imports all necessary Angular modules and configures
 * the application for volunteer event discovery and management.
 */
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    NotificationCenterComponent,
    EventListingComponent,
    EventDetailComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
