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
}
