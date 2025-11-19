import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Unit} from 'src/app/api/models/unit';

@Injectable({providedIn: 'root'})
export class UnitContextService {
  private unitSubject = new BehaviorSubject<Unit | null>(null);
  unit$ = this.unitSubject.asObservable();

  setUnit(unit: Unit) {
    this.unitSubject.next(unit);
  }
}
