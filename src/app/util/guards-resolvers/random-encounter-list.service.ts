import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { BeastService } from '../services/beast.service';

@Injectable({
  providedIn: 'root'
})
export class RandomEncounterListService implements Resolve<any> {

  constructor(
    private beastService: BeastService
  ) { }

  resolve(  ): Observable<any> {
    return this.beastService.getListsWithBeasts();
  }

}
