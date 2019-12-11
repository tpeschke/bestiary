import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BeastService } from './beast.service';

@Injectable({
  providedIn: 'root'
})
export class SingleBeastResolverService implements Resolve<any> {

  constructor(
    private beastService: BeastService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    let id = +route.paramMap.get('id');
    if (id) {
      return this.beastService.getSingleBeast(id);
    } else {
      return null
    }
   }
}
