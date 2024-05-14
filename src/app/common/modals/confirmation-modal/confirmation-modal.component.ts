/* eslint-disable prettier/prettier */
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, Input, Inject} from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;
  @Input() action: () => void;

  constructor(
    @Inject(AlertService) private alertService: any,
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
  ) {}

  ngOnInit(): void {
    console.log('confirmation-model ngOnInit()');
  }

  public confirmAction() {
    if (typeof this.action === 'function') {
      this.action();
    } else {
      this.alertService.error(`${this.title} action failed.`);
    }

    this.dialogRef.close();
  }

  public cancelAction() {
    this.alertService.success(`${this.title} action cancelled.`);
    this.dialogRef.close();
  }
}
