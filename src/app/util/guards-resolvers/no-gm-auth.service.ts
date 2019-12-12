import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BeastService } from '../services/beast.service'

@Injectable({
  providedIn: 'root'
})
export class NoGmAuthService {

  constructor(
    private router: Router,
    private beastService: BeastService
    ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.beastService.loggedIn === 'owner' || +this.beastService.loggedIn > 3) {
      this.router.navigate(['/main/beast/',next.paramMap.get('id'), 'gm' ])
      return false
    }
    return true
  }
}
