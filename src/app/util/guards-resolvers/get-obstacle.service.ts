import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ObstacleService } from '../services/obstacle.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetObstacleService {

  constructor(
    private obstacleService: ObstacleService,
    private router: Router
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    let id = route.paramMap.get('id').split(',')
    if (+id[0] > 0) {
      let type = id.length > 1 ? id[1] : 'obstacle'
      return this.obstacleService.getObstacle(+id[0], type)
        .pipe(
          tap(_ => {
            var scrollToTop = window.setInterval(function () {
              var pos = window.pageYOffset;
              if (pos > 0) {
                window.scrollTo(0, pos - 20);
              } else {
                window.clearInterval(scrollToTop);
              }
            }, 0);
          }));
    } else {
      return null
    }
  }
}

