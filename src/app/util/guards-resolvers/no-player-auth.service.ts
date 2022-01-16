import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BeastService } from '../services/beast.service'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NoPlayerAuthService implements CanActivate {

  constructor(
    private router: Router,
    private beastService: BeastService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.beastService.checkPlayerCanView(next.paramMap.get('id'))
    .pipe(
      map(({canView}) => {
        console.log(canView)
          if (canView) {
            return true
          }
          this.router.navigate(['/beast/', next.paramMap.get('id'), 'player'])
          return false
      })
    )
  }
}
