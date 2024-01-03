import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BeastService } from '../services/beast.service'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PatreonAuthService {

  constructor(
    private router: Router,
    private beastService: BeastService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.beastService.canAccessCustomCatalog()
    .pipe(
      map((result: any) => {
          if (result.canGo) {
            return true
          }
          this.router.navigate(['/'])
          return false
      })
    )
  }
}
