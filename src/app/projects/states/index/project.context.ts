import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Project} from 'src/app/api/models/project';

@Injectable({providedIn: 'root'})
export class ProjectContextService {
  private projectSubject = new BehaviorSubject<Project | null>(null);
  project$ = this.projectSubject.asObservable();

  setProject(project: Project) {
    this.projectSubject.next(project);
  }
}
