import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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
    let templateId = +route.paramMap.get('templateId')
    console.log(id, templateId)
    if (templateId) {
      return this.beastService.getSingleBeast(templateId)
        .pipe(
          tap(_ => {
            var scrollToTop = window.setInterval(function () {
              var pos = window.pageYOffset;
              if (pos > 0) {
                window.scrollTo(0, pos - 20); // how far to scroll on each step
              } else {
                window.clearInterval(scrollToTop);
              }
            }, 0);
          }),
          catchError(this.beastService.handleError('get single monster', [])
          ));
    } else if (id) {
      return this.beastService.getSingleBeast(id)
        .pipe(
          tap(_ => {
            var scrollToTop = window.setInterval(function () {
              var pos = window.pageYOffset;
              if (pos > 0) {
                window.scrollTo(0, pos - 20); // how far to scroll on each step
              } else {
                window.clearInterval(scrollToTop);
              }
            }, 0);
          }),
          catchError(this.beastService.handleError('get single monster', [])
          ));
    } else {
      return null
    }
  }
}
