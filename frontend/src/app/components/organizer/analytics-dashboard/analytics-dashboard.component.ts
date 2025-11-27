import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnalyticsService, EventAnalytics, ApplicationAnalytics, VolunteerAnalytics, EventTrends, SkillDemand } from '../../../services/analytics.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Analytics Dashboard Component
 * Displays comprehensive analytics and metrics
 */
@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent implements OnInit, OnDestroy {
  // Analytics Data
  eventAnalytics: EventAnalytics | null = null;
  applicationAnalytics: ApplicationAnalytics | null = null;
  volunteerAnalytics: VolunteerAnalytics | null = null;
  eventTrends: EventTrends[] = [];
  skillDemand: SkillDemand[] = [];

  // UI State
  loading = false;
  error = '';
  selectedPeriod = 30; // days
  activeTab = 'overview'; // overview, events, applications, volunteers, skills

  // Cleanup
  private destroy$ = new Subject<void>();

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.loadAnalytics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all analytics data
   */
  loadAnalytics(): void {
    this.loading = true;
    this.error = '';

    // Load event analytics
    this.analyticsService.getEventAnalytics()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.eventAnalytics = data;
        },
        (error) => {
          console.error('Error loading event analytics:', error);
          this.error = 'Failed to load event analytics';
        }
      );

    // Load application analytics
    this.analyticsService.getApplicationAnalytics()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.applicationAnalytics = data;
        },
        (error) => {
          console.error('Error loading application analytics:', error);
          this.error = 'Failed to load application analytics';
        }
      );

    // Load volunteer analytics
    this.analyticsService.getVolunteerAnalytics()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.volunteerAnalytics = data;
        },
        (error) => {
          console.error('Error loading volunteer analytics:', error);
          this.error = 'Failed to load volunteer analytics';
        }
      );

    // Load event trends
    this.analyticsService.getEventTrends(this.selectedPeriod)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.eventTrends = data;
        },
        (error) => {
          console.error('Error loading event trends:', error);
        }
      );

    // Load skill demand
    this.analyticsService.getSkillDemand()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.skillDemand = data;
          this.loading = false;
        },
        (error) => {
          console.error('Error loading skill demand:', error);
          this.loading = false;
        }
      );
  }

  /**
   * Refresh analytics
   */
  refreshAnalytics(): void {
    this.loadAnalytics();
  }

  /**
   * Change time period
   */
  changePeriod(days: number): void {
    this.selectedPeriod = days;
    this.loadAnalytics();
  }

  /**
   * Export analytics as CSV
   */
  exportCSV(type: string): void {
    this.analyticsService.exportAnalyticsCSV(type).subscribe(
      (blob) => {
        this.downloadFile(blob, `analytics-${type}.csv`);
      },
      (error) => {
        console.error('Error exporting CSV:', error);
        this.error = 'Failed to export analytics';
      }
    );
  }

  /**
   * Export analytics as PDF
   */
  exportPDF(type: string): void {
    this.analyticsService.exportAnalyticsPDF(type).subscribe(
      (blob) => {
        this.downloadFile(blob, `analytics-${type}.pdf`);
      },
      (error) => {
        console.error('Error exporting PDF:', error);
        this.error = 'Failed to export analytics';
      }
    );
  }

  /**
   * Download file helper
   */
  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Get metric color
   */
  getMetricColor(value: number, threshold: number): string {
    return this.analyticsService.getMetricColor(value, threshold);
  }

  /**
   * Format number
   */
  formatNumber(num: number): string {
    return this.analyticsService.formatNumber(num);
  }

  /**
   * Get approval rate
   */
  getApprovalRate(): number {
    if (!this.applicationAnalytics) return 0;
    return this.analyticsService.calculateApprovalRate(
      this.applicationAnalytics.approvedApplications,
      this.applicationAnalytics.totalApplications
    );
  }

  /**
   * Get volunteer percentage
   */
  getVolunteerPercentage(): number {
    if (!this.eventAnalytics) return 0;
    return this.analyticsService.calculateVolunteerPercentage(
      this.eventAnalytics.totalVolunteersConfirmed,
      this.eventAnalytics.totalVolunteersNeeded
    );
  }

  /**
   * Switch tab
   */
  switchTab(tab: string): void {
    this.activeTab = tab;
  }
}
