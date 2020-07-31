import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import local from '../../../local';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { mapChildrenIntoArray } from '@angular/router/src/url_tree';
import { makePropDecorator } from '@angular/core/src/util/decorators';

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

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status === 200) {
        this.toastr.success('', `${error.error.text}`);
      } else if (error.status === 403) {
        this.toastr.warning('', `${error.error}`)
      } else if (error.status === 401) {
        this.router.navigate(["/catalog"]);
        this.toastr.error('', `${error.error}`);
      }
      return of(result as T)
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
    return this.http.post(local.endpointBase + '/api/v1/upload/' + id, imageForm);
  }

  getCatalog(): any {
    return this.http.get(local.endpointBase + '/api/beasts/catalog')
      .pipe(
        // catchError(this.handleError('search', []))
      )
  }

  checkPlayerCanView(id): any {
    return this.http.get(local.endpointBase + '/api/playerCanView/' + id)
  }

  getSingleBeast(id): any {
    return this.http.get(local.endpointBase + '/api/beasts/' + id)
      .pipe(
        // catchError(this.handleError('get single beast', []))
      )
  }

  getPlayerBeast(id): any {
    return this.http.get(local.endpointBase + '/api/beasts/player/' + id)
      .pipe(
        // catchError(this.handleError('get single beast', []))
      )
  }

  updateBeast(beast): any {
    return this.http.patch(local.endpointBase + '/api/beasts/edit', beast)
      .pipe(
        // catchError(this.handleError('search', []))
      )
  }

  addBeast(beast): any {
    return this.http.post(local.endpointBase + '/api/beasts/add', beast)
      .pipe(
        // catchError(this.handleError('search', []))
      )
  }

  addPlayerNotes(notes): any {
    return this.http.post(local.endpointBase + '/api/beast/player', notes)
      .pipe(
        catchError(this.handleError('add player notes', []))
      )
  }

  deleteBeast(id): any {
    return this.http.delete(local.endpointBase + '/api/beasts/delete/' + id)
      .pipe(
        // catchError(this.handleError('search', []))
      )
  }

  searchBeasts(queries): any {
    return this.http.get(local.endpointBase + '/api/search', {params: queries})
      .pipe(
        catchError(this.handleError('get search beasts', []))
      )
  }
}
