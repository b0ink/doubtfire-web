import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Project} from 'src/app/api/models/project';
import {Unit} from 'src/app/api/models/unit';
import {UnitRole} from 'src/app/api/models/unit-role';
import {User} from 'src/app/api/models/user/user';
import {UnitService} from 'src/app/api/services/unit.service';
import {GlobalStateService} from 'src/app/projects/states/index/global-state.service';
import {CreateNewUnitModal} from '../../modals/create-new-unit-modal/create-new-unit-modal.component';

interface IUnitOrProject {
  id: number;
  unit_code: string;
  code: string;
  name: string;
  unit_role?: string;
  teaching_period: string;
  start_date: Date;
  end_date: Date;
  active: boolean;
  user?: User;
  unit?: Unit;
  student?: User;
  matchesTutorialEnrolments?: (filter: string) => boolean;
  matchesGroup?: (filter: string) => boolean;
  matches: (filter: string) => boolean;
}

@Component({
  selector: 'f-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FUnitsComponent implements OnInit {
  @Input({required: true}) mode: 'admin' | 'tutor' | 'student';

  title: string;
  filterValue = '';

  shouldShowUnitRoleColumn(): boolean {
    return this.mode === 'admin' || this.mode === 'tutor';
  }

  constructor(
    private createUnitDialog: CreateNewUnitModal,
    private globalStateService: GlobalStateService,
    private unitService: UnitService,
    private route: ActivatedRoute,
  ) {}

  units: IUnitOrProject[] = [];

  ngOnInit(): void {
    this.mode = this.mode ?? this.route.snapshot.data.mode;
    if (this.mode === 'tutor') {
      this.title = 'View all units you teach';

      this.globalStateService.onLoad(() => {
        this.globalStateService.loadedUnitRoles.values.subscribe({
          next: (unitRoles) => {
            this.units = this.mapUnitOrProjectsToColumns(unitRoles);
          },
        });
      });
    }
    if (this.mode === 'admin') {
      this.title = 'Administer units';

      this.globalStateService.onLoad(() => {
        this.unitService.query(undefined, {params: {include_in_active: true}}).subscribe({
          next: () => {
            this.globalStateService.loadedUnits.values.subscribe(
              (loadedUnits) => (this.units = this.mapUnitOrProjectsToColumns(loadedUnits)),
            );
          },
        });

        this.globalStateService.loadedUnits.values.subscribe(
          (units) => (this.units = this.mapUnitOrProjectsToColumns(units)),
        );
      });
    } else if (this.mode === 'student') {
      this.title = 'View all your units';

      this.globalStateService.onLoad(() => {
        this.globalStateService.currentUserProjects.values.subscribe(
          (projects) => (this.units = this.mapUnitOrProjectsToColumns(projects)),
        );
      });
    }
  }

  mapUnitSourceToColumn(unitOrProject: Unit | Project | UnitRole): IUnitOrProject {
    if (unitOrProject instanceof Unit) {
      return {
        id: unitOrProject.id,
        unit_code: unitOrProject.code,
        code: unitOrProject.code,
        name: unitOrProject.name,
        unit_role: unitOrProject.myRole,
        teaching_period: unitOrProject.teachingPeriod?.name || 'Custom',
        start_date: unitOrProject.startDate,
        end_date: unitOrProject.endDate,
        active: unitOrProject.active,
        matches: unitOrProject.matches,
      };
    } else if (unitOrProject instanceof Project) {
      return {
        id: unitOrProject.id,
        unit_code: unitOrProject.unit.code,
        code: unitOrProject.unit.code,
        name: unitOrProject.unit.name,
        teaching_period: unitOrProject.unit.teachingPeriod?.name,
        start_date: unitOrProject.unit.startDate,
        end_date: unitOrProject.unit.endDate,
        active: unitOrProject.unit.active,
        student: unitOrProject.student,
        matchesTutorialEnrolments: unitOrProject.matchesTutorialEnrolments,
        matchesGroup: unitOrProject.matchesGroup,
        matches: (filter: string) => {
          return (
            unitOrProject.unit.matches(filter) ||
            unitOrProject.student.matches(filter) ||
            unitOrProject.matchesTutorialEnrolments(filter) ||
            unitOrProject.matchesGroup(filter)
          );
        },
      };
    } else if (unitOrProject instanceof UnitRole) {
      return {
        id: unitOrProject.unit.id,
        unit_code: unitOrProject.unit.code,
        code: unitOrProject.unit.code,
        name: unitOrProject.unit.name,
        unit_role: unitOrProject.role,
        teaching_period: unitOrProject.unit.teachingPeriod?.name,
        start_date: unitOrProject.unit.startDate,
        end_date: unitOrProject.unit.endDate,
        active: unitOrProject.unit.active,
        user: unitOrProject.user,
        unit: unitOrProject.unit,
        matches: unitOrProject.matches,
      };
    }
  }

  mapUnitOrProjectsToColumns(unitOrProjects: readonly (Unit | Project | UnitRole)[]) {
    // copy the array of units/projects/unitRole and map each unit through the mapUnitSourceToColumn function
    return [...unitOrProjects].map((unitOrProject) => this.mapUnitSourceToColumn(unitOrProject));
  }

  get filteredUnits(): IUnitOrProject[] {
    const filter = this.filterValue.trim().toLowerCase();
    return filter ? this.units.filter((unit) => unit.matches(filter)) : this.units;
  }

  createUnit() {
    this.createUnitDialog.show();
  }

  readonly compareUnitCode = (a: IUnitOrProject, b: IUnitOrProject) =>
    a.unit_code.localeCompare(b.unit_code);
  readonly compareName = (a: IUnitOrProject, b: IUnitOrProject) => a.name.localeCompare(b.name);
  readonly compareRole = (a: IUnitOrProject, b: IUnitOrProject) =>
    (a.unit_role ?? '').localeCompare(b.unit_role ?? '');
  readonly compareTeachingPeriod = (a: IUnitOrProject, b: IUnitOrProject) =>
    (a.teaching_period ?? '').localeCompare(b.teaching_period ?? '');
  readonly compareStartDate = (a: IUnitOrProject, b: IUnitOrProject) =>
    a.start_date.getTime() - b.start_date.getTime();
  readonly compareEndDate = (a: IUnitOrProject, b: IUnitOrProject) =>
    a.end_date.getTime() - b.end_date.getTime();
  readonly compareActive = (a: IUnitOrProject, b: IUnitOrProject) =>
    Number(a.active) - Number(b.active);
}
