import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BeastService } from '../services/beast.service';
import { ObstacleService } from '../services/obstacle.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogResolverService implements Resolve<any> {

  constructor(
    private beastService: BeastService,
    private obstacleService: ObstacleService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    if (state.url.includes('obstacle')) {
      return this.obstacleService.getCatalog();
    }
    if (state.url.includes('custom')) {
      return this.beastService.getCustomCatalog();
    }
    return this.beastService.getCatalog();
   }
}
