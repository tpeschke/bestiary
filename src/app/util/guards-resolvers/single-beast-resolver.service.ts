import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BeastService } from '../services/beast.service';

@Injectable({
  providedIn: 'root'
})
export class SingleBeastResolverService implements Resolve<any> {

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
      return this.beastService.getSingleBeast(id)
        .pipe(
          catchError(this.beastService.handleError('get single monster', [])
        ));
    } else {
      return null
    }
  }
}
