import {Component, OnInit} from '@angular/core';
import {StateService} from '@uirouter/core';
import {Project} from 'src/app/api/models/project';
import {ProjectService} from 'src/app/api/services/project.service';
import {UnitService} from 'src/app/api/services/unit.service';
import {AlertService} from 'src/app/common/services/alert.service';
import {GlobalStateService, ViewType} from 'src/app/projects/states/index/global-state.service';
import {ProjectContextService} from 'src/app/projects/states/index/project.context';

@Component({
  selector: 'f-projects-groups',
  templateUrl: 'projects-groups-route.component.html',
  styleUrls: ['projects-groups-route.component.scss'],
})
export class ProjectGroupsComponent implements OnInit {
  public project: Project;

  constructor(
    private globalStateService: GlobalStateService,
    private unitService: UnitService,
    private projectService: ProjectService,
    private stateService: StateService,
    private alertService: AlertService,
    private projectContext: ProjectContextService,
  ) {}

  ngOnInit(): void {
    this.projectContext.project$.subscribe((project) => {
      if (!project) {
        // TODO: redirect back home
        return;
      }
      this.project = project;
      this.globalStateService.setView(ViewType.PROJECT, project);
    });
  }
}
