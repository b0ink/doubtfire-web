import {Injectable} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {CalendarModalComponent} from './calendar-modal.component';
import {Task} from 'src/app/api/models/task';

@Injectable({
  providedIn: 'root',
})
export class CalendarModalService {
  constructor(public dialog: MatDialog) {}

  public show(task?: Task) {
    let dialogRef: MatDialogRef<CalendarModalComponent, any>;
    dialogRef = this.dialog.open(CalendarModalComponent);
  }
}
