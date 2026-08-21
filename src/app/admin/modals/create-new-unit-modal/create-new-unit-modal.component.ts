import {NzModalService} from 'ng-zorro-antd/modal';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CreateNewUnitModalContentComponent} from './create-new-unit-modal-content.component';

@Component({
  selector: 'create-new-unit-modal',
  templateUrl: './create-new-unit-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CreateNewUnitModal {
  constructor(public modal: NzModalService) {}
  public show(): void {
    this.modal.create({
      nzTitle: 'Create Unit',
      nzContent: CreateNewUnitModalContentComponent,
      nzFooter: null,
      nzWidth: 500,
    });
  }
}
