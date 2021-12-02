import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import local from '../../../local';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ObstacleService {

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  handleMessage(result) {
    let { message: info, color } = result;
    if (info) {
      if (color === 'green') {
        this.toastr.success(info)
      } else if (color === 'blue') {
        this.toastr.info(info)
      } else if (color === 'yellow') {
        this.toastr.warning(info)
      } else if (color === 'red') {
        this.toastr.error(info)
      }
    }
  }

  getObstacle(id, edit): any {
    return {}
    // return this.http.get(local.endpointBase + '/api/beasts/' + id, { params: edit })
    //   .pipe(
    //     tap(result => this.handleMessage(result))
    //   );
  }

  updateObstacle(obstacle): any {
    return this.http.post(local.endpointBase + '/api/obstacles/add', obstacle)
      .pipe(
        tap(result => this.handleMessage(result))
      );
  }
}
