import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SettingsOnlyService {
  private _titles = new BehaviorSubject<{ title: string, subtitle: string }>
    ({ title: 'Editar perfil', subtitle: 'Define tus datos de acceso público' });
  titles$: Observable<{ title: string, subtitle: string }> = this._titles.asObservable();

  constructor() { }

  setTitles(titles: { title: string, subtitle: string }) {
    this._titles.next(titles);
  }

  getTitles() {
    return this._titles.value;
  }
}
