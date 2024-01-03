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
    console.log(next.paramMap.get('id'))
    return this.beastService.checkIfCanEdit(next.paramMap.get('id')).pipe(
      map((result: any) => {
        return result.canEdit
      })
    )
  }
}
