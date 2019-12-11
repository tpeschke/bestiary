import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import local from '../../local';

class Beast {
  id: number
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class BeastService {

  constructor(
    private http: HttpClient,
  ) { }

  loggedIn = 'owner';

  getCatalog(): any {
    return this.http.get(local.endpointBase + '/api/beasts/catalog')
      .pipe(
        // catchError(this.handleError('search', []))
      )
  }

  getSingleBeast(id): any {
    return this.http.get(local.endpointBase + '/api/beasts/' + id)
      .pipe(
        // catchError(this.handleError('search', []))
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

  deleteBeast(id): any {
    return this.http.delete(local.endpointBase + '/api/beasts/delete/' + id)
      .pipe(
        // catchError(this.handleError('search', []))
      )
  }
}
