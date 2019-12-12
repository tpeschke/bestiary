import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BeastService } from './beast.service'

@Injectable({
  providedIn: 'root'
})
export class NoLoginAuthService implements CanActivate {

  constructor(
    private router: Router,
    private beastService: BeastService
    ) { }

    canActivate(
    ): Observable<boolean> | Promise<boolean> | boolean {
      if (!this.beastService.loggedIn) {
        this.beastService.checkLogin().subscribe(_=> {
          return this.checkLogin()
        })
      } else {
        return this.checkLogin()
      }
    }

    checkLogin() {
      if (!this.beastService.loggedIn) {
        this.router.navigateByUrl('/login')
        return false
      } else {
        return true
      }
    }
}
