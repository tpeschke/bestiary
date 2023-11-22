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

  getCatalog(): any {
    return this.http.get(local.endpointBase + '/api/obstacles/catalog')
    .pipe(tap(result => this.handleMessage(result)))
  }

  getObstacle(id, type): any {
    return this.http.get(local.endpointBase + '/api/obstacles/single/' + id, { params: {type}})
    .pipe(tap(result => this.handleMessage(result)))
  }

  updateObstacle(obstacle): any {
    return this.http.post(local.endpointBase + '/api/obstacles/add', obstacle)
    .pipe(tap(result => this.handleMessage(result)))
  }

  deleteObstacle(id): any {
    return this.http.delete(local.endpointBase + '/api/obstacles/' + id)
    .pipe(tap(result => this.handleMessage(result)))
  }

  searchObstacles(params): any {
    return this.http.get(local.endpointBase + '/api/obstacles/search', { params })
    .pipe(tap(result => this.handleMessage(result)))
  }

  checkIfObstacleIsValid(name): any {
    return this.http.get(local.endpointBase + '/api/obstacles/isValid/' + name)
    .pipe(tap(result => this.handleMessage(result)))
  }
}
