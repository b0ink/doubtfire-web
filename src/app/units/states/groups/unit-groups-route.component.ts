import {Component, OnInit} from '@angular/core';
import {StateService} from '@uirouter/core';
import {Unit} from 'src/app/api/models/unit';
import {ProjectService} from 'src/app/api/services/project.service';
import {UnitService} from 'src/app/api/services/unit.service';
import {AlertService} from 'src/app/common/services/alert.service';
import {GlobalStateService} from 'src/app/projects/states/index/global-state.service';
import {ProjectContextService} from 'src/app/projects/states/index/project.context';
import {UnitContextService} from '../index/unit.context';

@Component({
  selector: 'f-unit-groups',
  templateUrl: 'unit-groups-route.component.html',
  styleUrls: ['unit-groups-route.component.scss'],
})
export class UnitGroupsComponent implements OnInit {
  public unit: Unit;

  constructor(
    private globalStateService: GlobalStateService,
    private unitService: UnitService,
    private projectService: ProjectService,
    private stateService: StateService,
    private alertService: AlertService,
    private projectContext: ProjectContextService,
    private unitContext: UnitContextService,
  ) {}

  ngOnInit(): void {
    // TODO 10.0.x: Unit and student loading needs to be moved to the parent controller (units/{unitId}) when everything is migrated
    this.unitContext.unit$.subscribe((unit) => {
      if (!unit) {
        return;
      }
      this.unit = unit;
    });
  }
}
