import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Unit} from 'src/app/api/models/unit';
import {UnitService} from 'src/app/api/services/unit.service';
import {UnitContextService} from './unit.context';

@Component({
  selector: 'f-projects-root',
  template: `
    <div *ngIf="unit$ | async as unit">
      <h1>{{ unit.name }}</h1>
      <router-outlet></router-outlet>
      <!-- child routes render here -->
    </div>
    <div *ngIf="(unit$ | async) === false">Loading...</div>
  `,
})
export class UnitsRootComponent implements OnInit {
  unit$!: Observable<Unit>;

  constructor(
    private unitService: UnitService,
    private route: ActivatedRoute,
    private unitContext: UnitContextService,
  ) {}

  ngOnInit() {
    const unitId = this.route.snapshot.paramMap.get('unitId')!;
    this.unit$ = this.unitService.get(unitId);
    this.unit$.subscribe((unit) => this.unitContext.setUnit(unit));
  }
}
