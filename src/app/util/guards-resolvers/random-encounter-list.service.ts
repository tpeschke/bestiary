import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BeastService } from '../services/beast.service';
import { ObstacleService } from '../services/obstacle.service';

@Injectable({
  providedIn: 'root'
})
export class RandomEncounterListService implements Resolve<any> {

  constructor(
    private beastService: BeastService,
    private obstacleService: ObstacleService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.beastService.getLists();
  }

}
