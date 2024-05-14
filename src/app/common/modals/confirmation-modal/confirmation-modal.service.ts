/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from './confirmation-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationModalService {
  constructor(public dialog: MatDialog) {}

  public show(title: string, message: string, action?: any) {
    let dialogRef: MatDialogRef<ConfirmationModalComponent, any>;
    dialogRef = this.dialog.open(ConfirmationModalComponent, {position: {top: '2.5%'}});
    dialogRef.updateSize('42.5%', '');
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.action = action;
  }
}
