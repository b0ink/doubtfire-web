import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {DatePickerModule} from 'primeng/datepicker';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextModule} from 'primeng/inputtext';
import {SelectModule} from 'primeng/select';
import {TableModule} from 'primeng/table';
import {TextareaModule} from 'primeng/textarea';
import {ToggleSwitchModule} from 'primeng/toggleswitch';
import {TooltipModule} from 'primeng/tooltip';
import {NgModule} from '@angular/core';

const PRIME_NG_MODULES = [
  ButtonModule,
  CardModule,
  DatePickerModule,
  DynamicDialogModule,
  InputNumberModule,
  InputTextModule,
  SelectModule,
  TableModule,
  TextareaModule,
  ToggleSwitchModule,
  TooltipModule,
];

@NgModule({
  imports: PRIME_NG_MODULES,
  exports: PRIME_NG_MODULES,
})
export class UnitDetailsPrimeNgModule {}
