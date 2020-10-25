import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import local from '../../../local';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

class User {
  id: number
  patreon?: number
}
@Injectable({
  providedIn: 'root'
})
export class BeastService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) { }

  public loggedIn:boolean|string|number = false

  handleMessage(message) {
    let {message: info, color } = message;
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

  checkLogin() {
    return this.http.get(local.endpointBase + '/api/auth/me').pipe(
      map((result: User) => {
        if (result.id === 1 || result.id === 21) {
          return 'owner'
        } else if (result.id && result.patreon) {
          return result.patreon
        } else if (result.id) {
          return true;
        }
      })
    )
  }

  imageUpload(imageForm: FormData, id: number) {
    this.toastr.warning('', `image uploading`)
    return this.http.post(local.endpointBase + '/api/v1/upload/' + id, imageForm)
    .pipe(
      tap(result => this.handleMessage({color: 'green', message: 'image finised uploading'}))
    );
  }

  getCatalog(): any {
    return this.http.get(local.endpointBase + '/api/beasts/catalog')
  }

  checkPlayerCanView(id): any {
    return this.http.get(local.endpointBase + '/api/playerCanView/' + id)
  }

  getSingleBeast(id, edit): any {
    return this.http.get(local.endpointBase + '/api/beasts/' + id, {params: edit})
    .pipe(
      tap(result => this.handleMessage(result))
    );
  }

  getPlayerBeast(id): any {
    return this.http.get(local.endpointBase + '/api/beasts/player/' + id)
  }

  updateBeast(beast): any {
    return this.http.patch(local.endpointBase + '/api/beasts/edit', beast)
  }

  addBeast(beast): any {
    return this.http.post(local.endpointBase + '/api/beasts/add', beast)
  }

  addPlayerNotes(notes): any {
    return this.http.post(local.endpointBase + '/api/beast/player', notes)
  }

  addFavorite(beastid): any {
    return this.http.post(local.endpointBase + '/api/favorite', {beastid})
    .pipe(
      tap(result => this.handleMessage(result))
    );
  }

  deleteFavorite(beastid): any {
    return this.http.delete(local.endpointBase + '/api/favorite/' + beastid)
    .pipe(
      tap(result => this.handleMessage(result))
    );
  }

  getFavorites() {
    return this.http.get(local.endpointBase + '/api/favorites')
  }

  deleteBeast(id): any {
    return this.http.delete(local.endpointBase + '/api/beasts/delete/' + id)
  }

  searchBeasts(queries): any {
    return this.http.get(local.endpointBase + '/api/search', {params: queries})
  }
}
