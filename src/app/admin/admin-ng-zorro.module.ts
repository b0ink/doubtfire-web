import {
  ArrowDownOutline,
  ArrowUpOutline,
  CloseOutline,
  CopyOutline,
  DeleteOutline,
  DownloadOutline,
  EditOutline,
  ImportOutline,
  PlusOutline,
  RedoOutline,
  SaveOutline,
  SearchOutline,
  WarningOutline,
} from '@ant-design/icons-angular/icons';
import {NzAlertModule} from 'ng-zorro-antd/alert';
import {NzAutocompleteModule} from 'ng-zorro-antd/auto-complete';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzSkeletonModule} from 'ng-zorro-antd/skeleton';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {NzTooltipModule} from 'ng-zorro-antd/tooltip';
import {NgModule} from '@angular/core';

const ADMIN_NG_ZORRO_MODULES = [
  NzAlertModule,
  NzAutocompleteModule,
  NzButtonModule,
  NzCardModule,
  NzCheckboxModule,
  NzCollapseModule,
  NzDatePickerModule,
  NzDividerModule,
  NzEmptyModule,
  NzFormModule,
  NzInputModule,
  NzInputNumberModule,
  NzListModule,
  NzMenuModule,
  NzModalModule,
  NzPopconfirmModule,
  NzSelectModule,
  NzSkeletonModule,
  NzSpinModule,
  NzSwitchModule,
  NzTableModule,
  NzTabsModule,
  NzTagModule,
  NzTooltipModule,
];

@NgModule({
  imports: [
    NzIconModule.forRoot([
      ArrowDownOutline,
      ArrowUpOutline,
      CloseOutline,
      CopyOutline,
      DeleteOutline,
      DownloadOutline,
      EditOutline,
      ImportOutline,
      PlusOutline,
      RedoOutline,
      SaveOutline,
      SearchOutline,
      WarningOutline,
    ]),
    ...ADMIN_NG_ZORRO_MODULES,
  ],
  exports: [NzIconModule, ...ADMIN_NG_ZORRO_MODULES],
})
export class AdminNgZorroModule {}
