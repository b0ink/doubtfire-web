import {NZ_MODAL_DATA, NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Campus} from 'src/app/api/models/campus/campus';
import {TeachingPeriodBreak} from 'src/app/api/models/teaching-period';
import {TeachingPeriod} from 'src/app/api/models/teaching-period';
import {CampusService} from 'src/app/api/services/campus.service';
import {TeachingPeriodBreakService} from 'src/app/api/services/teaching-period-break.service';
import {TeachingPeriodService} from 'src/app/api/services/teaching-period.service';
import {AlertService} from 'src/app/common/services/alert.service';
import {TeachingPeriodUnitImportService} from '../teaching-period-unit-import/teaching-period-unit-import.dialog';

@Component({
  selector: 'f-teaching-period-list',
  templateUrl: './teaching-period-list.component.html',
  styleUrls: ['./teaching-period-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TeachingPeriodListComponent implements OnInit {
  public teachingPeriods: TeachingPeriod[] = [];

  constructor(
    private teachingPeriodsService: TeachingPeriodService,
    public modal: NzModalService,
    public teachingPeriodUnitImportService: TeachingPeriodUnitImportService,
  ) {}

  ngOnInit(): void {
    // update the Teaching Periods
    this.teachingPeriodsService.query().subscribe();

    // Bind to the Teaching Periods
    this.teachingPeriodsService.cache.values.subscribe((teachingPeriods) => {
      this.teachingPeriods = [...teachingPeriods];
    });
  }

  importUnits(teachingPeriod: TeachingPeriod) {
    this.teachingPeriodUnitImportService.openImportUnitsDialog(teachingPeriod);
  }

  addTeachingPeriod() {
    this.modal.create({
      nzTitle: 'New teaching period',
      nzContent: NewTeachingPeriodDialogComponent,
      nzData: {},
      nzFooter: null,
      nzWidth: 720,
    });
  }

  selectTeachingPeriod(selectedTeachingPeriod: TeachingPeriod) {
    this.teachingPeriodsService.get(selectedTeachingPeriod.id).subscribe((teachingPeriod) => {
      this.modal.create({
        nzTitle: 'Edit teaching period',
        nzContent: NewTeachingPeriodDialogComponent,
        nzData: {teachingPeriod},
        nzFooter: null,
        nzWidth: 720,
      });
    });
  }

  private sortDateValue(value: Date | string): number {
    const time = new Date(value).getTime();
    return Number.isFinite(time) ? time : 0;
  }

  readonly compareActive = (a: TeachingPeriod, b: TeachingPeriod) =>
    Number(a.active) - Number(b.active);
  readonly compareName = (a: TeachingPeriod, b: TeachingPeriod) => a.name.localeCompare(b.name);
  readonly compareStartDate = (a: TeachingPeriod, b: TeachingPeriod) =>
    this.sortDateValue(a.startDate) - this.sortDateValue(b.startDate);
  readonly compareEndDate = (a: TeachingPeriod, b: TeachingPeriod) =>
    this.sortDateValue(a.endDate) - this.sortDateValue(b.endDate);
  readonly compareActiveUntil = (a: TeachingPeriod, b: TeachingPeriod) =>
    this.sortDateValue(a.activeUntil) - this.sortDateValue(b.activeUntil);
}

@Component({
  selector: 'f-new-teaching-period-dialog',
  templateUrl: 'new-teaching-period-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class NewTeachingPeriodDialogComponent implements OnInit {
  constructor(
    @Inject(NZ_MODAL_DATA) public data: {teachingPeriod?: TeachingPeriod},
    private modalRef: NzModalRef<NewTeachingPeriodDialogComponent>,
    public teachingPeriodService: TeachingPeriodService,
    public teachingPeriodBreakService: TeachingPeriodBreakService,
    public campusService: CampusService,
    public alertService: AlertService,
  ) {}
  public newOrSelectedTeachingPeriod: TeachingPeriod =
    this.data.teachingPeriod || new TeachingPeriod();
  public teachingBreaks$: Observable<TeachingPeriodBreak[]> = this.newOrSelectedTeachingPeriod
    .breaksCache.values as Observable<TeachingPeriodBreak[]>;

  public tempBreak = new TeachingPeriodBreak();
  public editingBreak: TeachingPeriodBreak;
  public campuses: Campus[] = [];

  ngOnInit(): void {
    this.campusService.query().subscribe((campuses) => (this.campuses = campuses));
  }

  addTeachingBreak() {
    this.newOrSelectedTeachingPeriod
      .addBreak(this.tempBreak.startDate, this.tempBreak.numberOfWeeks, this.tempBreak.campusIds)
      .subscribe({
        next: (teachingPeriodBreak) => {
          this.alertService.success('Break added');
          console.log(teachingPeriodBreak);
        },
        error: (response) => {
          this.alertService.error(`Error adding break. ${response}`);
        },
      });
  }

  deleteBreak(teachingPeriod: TeachingPeriod, teachingBreak: TeachingPeriodBreak): void {
    teachingPeriod.removeBreak(teachingBreak.id).subscribe({
      next: (teachingPeriodBreak) => {
        console.log(teachingPeriodBreak);
      },
      error: (response) => {
        this.alertService.error(`Error deleting break. ${response}`);
      },
    });
  }

  editTeachingBreak(teachingBreak: TeachingPeriodBreak): void {
    this.editingBreak = Object.assign(new TeachingPeriodBreak(), teachingBreak, {
      campusIds: [...teachingBreak.campusIds],
    });
  }

  cancelEditingBreak(): void {
    this.editingBreak = undefined;
  }

  saveTeachingBreak(teachingBreak: TeachingPeriodBreak): void {
    this.teachingPeriodBreakService
      .update(
        {
          teaching_period_id: this.newOrSelectedTeachingPeriod.id,
          id: teachingBreak.id,
        },
        {entity: this.editingBreak},
      )
      .subscribe({
        next: (updatedBreak) => {
          Object.assign(teachingBreak, updatedBreak);
          this.editingBreak = undefined;
          this.alertService.success('Break updated');
        },
        error: (response) => {
          this.alertService.error(`Error updating break. ${response}`);
        },
      });
  }

  campusName(campusId: number): string {
    return this.campuses.find((campus) => campus.id === campusId)?.name ?? `Campus ${campusId}`;
  }

  campusNames(campusIds: number[]): string {
    return campusIds.map((campusId) => this.campusName(campusId)).join(', ');
  }

  submitTeachingPeriod() {
    // Check if we are updating or creating a new teaching period
    const observer = this.newOrSelectedTeachingPeriod.id
      ? this.teachingPeriodService.update(this.newOrSelectedTeachingPeriod)
      : this.teachingPeriodService.store(this.newOrSelectedTeachingPeriod);

    // Save the teaching period
    observer.subscribe({
      next: (teachingPeriod) => {
        this.alertService.success(`${teachingPeriod.name} saved`);
        this.modalRef.close(teachingPeriod);
      },
      error: (response) => {
        this.alertService.error(`Error saving teaching period. ${response}`);
      },
    });
  }

  close(): void {
    this.modalRef.close();
  }
}
