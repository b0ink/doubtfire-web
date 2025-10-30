import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Task} from 'src/app/api/models/doubtfire-model';
import {MappingFunctions} from 'src/app/api/services/mapping-fn';
import {AlertService} from '../../services/alert.service';
import {ConfirmationModalService} from '../confirmation-modal/confirmation-modal.service';
import {GanttItem} from '@worktile/gantt';

@Component({
  selector: 'f-task-date-slider',
  styleUrl: './task-date-slider.component.scss',
  templateUrl: './task-date-slider.component.html',
})
export class TaskDateSliderComponent implements OnChanges {
  @Input() task: Task;
  @Input() showTaskAbbr: boolean = false;

  /**
   * The value of the slider, representing the number of weeks
   */
  public value: number;
  public startDay: number;

  private _originalDueDate: Date;
  private _originalExtension: number;

  items: GanttItem[] = [
    {id: '000000', title: 'Task 0', start: 1627729997, end: 1628421197},
    {id: '000001', title: 'Task 1', start: 1617361997, end: 1625483597},
  ];

  /**
   * Switch between edit and view mode.
   */
  public editMode: boolean = false;

  public constructor(
    private alerts: AlertService,
    private confirmationModalService: ConfirmationModalService,
  ) {}

  public get max(): number {
    return this.task.unit.totalDays + Math.ceil(this.task.project.specConDays);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.task && changes.task.currentValue) {
      if (this.editMode) {
        this.cancelEdit();
      }

      this.value = this.task.dueDay;
      // this.startDay = this.task.startDay;

      this._originalDueDate = this.task.dueDate;
      this._originalExtension = this.task.extensions;

      const tdStartDay = Math.ceil(
        (this.task.definition.startDate.getTime() - this.task.unit.startDate.getTime()) /
          (1000 * 3600 * 24),
      );
      this.startDay = tdStartDay;
    }
  }

  public cancelEdit(): void {
    this.editMode = false;
    // Reset the task to its original state
    this.task.dueDate = this._originalDueDate;
    this.task.extensions = this._originalExtension;
    this.value = this.task.dueDay;
  }

  public updateExtension(event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.task.dueDay = value;
  }

  public updateStartDay(event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.task.startDay = value;
  }

  public editDueDate(): void {
    this.editMode = true;
  }

  public saveDueDate(): void {
    const save = () =>
      this.task.savePlannedDate().subscribe({
        next: () => {
          this.alerts.success('Plan updated successfully.');
          this.editMode = false;
          this.task.project.calcTopTasks();
        },
        error: (message) => {
          this.alerts.error(`Error updating due date: ${message}`, 6000);
          this.cancelEdit();
        },
      });

    if (this.afterDeadline()) {
      this.confirmationModalService.show(
        'Due date is after feedback deadline',
        'You won’t receive feedback for this task if you submit after the feedback cutoff. Do you want to continue?',
        save,
      );
    } else {
      save();
    }
  }

  public afterDeadline(): boolean {
    return this.task.localDueDate() > this.task.localDeadlineDate();
  }

  public closeToDeadline(): boolean {
    return MappingFunctions.addDays(this.task.localDueDate(), 7) > this.task.localDeadlineDate();
  }

  public canEdit(): boolean {
    return !this.task.isGroupTask() && this.task.unit.allowFlexibleDates;
  }
}
