import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BeastService } from '../services/beast.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerBeastResolverService implements Resolve<any> {

  constructor(
    private beastService: BeastService,
    private router: Router
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    let id = +route.paramMap.get('id');
    if (id) {
      return this.beastService.getPlayerBeast(id)
    } else {
      return null
    }
  }
}
