import {AfterViewInit, ChangeDetectionStrategy, Component} from '@angular/core';
import {TiiAction} from 'src/app/api/models/doubtfire-model';
import {TiiActionService} from 'src/app/api/services/tii-action.service';
import {AlertService} from 'src/app/common/services/alert.service';

@Component({
  selector: 'f-tii-action-log',
  templateUrl: './tii-action-log.component.html',
  styleUrls: ['./tii-action-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TiiActionLogComponent implements AfterViewInit {
  public tiiActions: TiiAction[] = [];
  public selectedTaskDefinition: TiiAction | null = null;
  public filter = '';

  constructor(
    private tiiActionService: TiiActionService,
    private alertService: AlertService,
  ) {}

  ngAfterViewInit(): void {
    this.tiiActionService.query().subscribe((actions) => {
      this.tiiActions = actions;
    });
  }

  public get filteredActions(): TiiAction[] {
    const filter = this.filter.trim().toLowerCase();
    return filter
      ? this.tiiActions.filter((action) =>
          (action as TiiAction & {matches(value: string): boolean}).matches(filter),
        )
      : this.tiiActions;
  }

  public compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  public retryAction(action: TiiAction) {
    this.tiiActionService
      .put(action, {
        body: {
          action: 'retry',
        },
      })
      .subscribe({
        next: () => {
          action.retry = true;
          this.alertService.success('Action has been queued for retry');
        },
        error: (error) => {
          this.alertService.error(`Failed to queue action for retry: ${error}`);
        },
      });
  }

  readonly compareType = (a: TiiAction, b: TiiAction) => a.type.localeCompare(b.type);
  readonly compareLastRun = (a: TiiAction, b: TiiAction) =>
    new Date(a.lastRun ?? 0).getTime() - new Date(b.lastRun ?? 0).getTime();
  readonly compareRetries = (a: TiiAction, b: TiiAction) => a.retries - b.retries;
}
