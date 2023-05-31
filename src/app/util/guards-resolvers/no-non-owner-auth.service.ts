import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BeastService } from '../services/beast.service'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NoNonOwnerService implements CanActivate {

  constructor(
    private router: Router,
    private beastService: BeastService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log(this.beastService.loggedIn)
    if (!this.beastService.loggedIn) {
      return this.beastService.checkLogin()
        .pipe(
          map((loggedIn) => {
            return this.routeWhere(loggedIn)
          })
        )
    } else {
      return this.routeWhere(this.beastService.loggedIn)
    }
  }

  routeWhere = (loggedIn) => {
    if (loggedIn === 'owner') {
      return true
    } else {
      this.router.navigate(['catalog'])
      return false
    }
  }

}
