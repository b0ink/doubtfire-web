import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Project} from 'src/app/api/models/project';
import {ProjectService} from 'src/app/api/services/project.service';
import {ProjectContextService} from './project.context';

@Component({
  selector: 'f-projects-root',
  template: `
    <div *ngIf="project$ | async as project">
      <h1>{{ project.name }}</h1>
      <router-outlet></router-outlet>
      <!-- child routes render here -->
    </div>
    <div *ngIf="(project$ | async) === false">Loading...</div>
  `,
})
export class ProjectsRootComponent implements OnInit {
  project$!: Observable<Project>;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private projectContext: ProjectContextService,
  ) {}

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('projectId')!;
    this.project$ = this.projectService.get(projectId);
    this.project$.subscribe((project) => this.projectContext.setProject(project));
  }
}
