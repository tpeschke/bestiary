import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  public loggedIn: boolean | string | number = false

  handleMessage(message) {
    let { message: info, color } = message;
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

  handleError = (error: HttpErrorResponse) => {
    this.toastr.error(`Error: ${error.statusText}`)
    return throwError(() => new Error(`${error.statusText}`));
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

  uploadMainImage = (imageForm: FormData, id: number) => {
    this.toastr.warning('', `Image Uploading`)
    return this.http.post(local.endpointBase + '/api/v1/upload/' + id, imageForm)
      .pipe(
        catchError(this.handleError),
        tap(result => this.handleMessage({ color: 'green', message: 'Image Finished Uploading' }))
      );
  }

  uploadTokenImage = (imageForm: FormData, id: number) => {
    this.toastr.warning('', `Token Uploading`)
    return this.http.post(local.endpointBase + '/api/v1/uploadToken/' + id, imageForm)
      .pipe(
        catchError(this.handleError),
        tap(result => this.handleMessage({ color: 'green', message: 'The Token Finished Uploading' }))
      );
  }

  checkToken = (id: number) => {
    return this.http.get(local.endpointBase + '/api/checkToken/' + id)
      .pipe(catchError(this.handleError));
  }

  getCatalog(): any {
    return this.http.get(local.endpointBase + '/api/beasts/catalog')
  }

  checkPlayerCanView(id): any {
    return this.http.get(local.endpointBase + '/api/playerCanView/' + id)
  }

  getSingleBeast(id, edit): any {
    return this.http.get(local.endpointBase + '/api/beasts/' + id, { params: edit })
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
    return this.http.post(local.endpointBase + '/api/favorite', { beastid })
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
    return this.http.get(local.endpointBase + '/api/search', { params: queries })
  }

  getEditEncounter(beastid) {
    return this.http.get(local.endpointBase + '/api/encounter/edit/' + beastid)
  }

  getRandomEncounter(beastid, groupId) {
    return this.http.get(local.endpointBase + '/api/encounter/' + beastid, { params: {groupId} })
  }

  getRandomMonster(): any {
    return this.http.get(local.endpointBase + '/api/randomMonster')
  }

  getQuickView(hash): any {
    return this.http.get(`${local.endpointBase}/api/quickview/${hash}`)
      .pipe(
        tap(result => this.handleMessage(result))
      );
  }

  getEquipment(): any {
    return this.http.get(`${local.endpointBase}/api/equipment`)
  }

  getCombatSquare(combatStats, role, points, size): any {
    return this.http.patch(local.endpointBase + '/api/combatSquare', {combatStats, role, points, size})
  }

  getMovement(movements): any {
    return this.http.patch(local.endpointBase + '/api/movement', {movements})
  }

  getVitalityAndStress(points, role, combatStats, secondaryrole, knockback, size, armor, shield): any {
    return this.http.patch(local.endpointBase + '/api/vitalityAndStress', {points, role, combatStats, secondaryrole, knockback, size, armor, shield})
  }

  getUniqueEquipment(equipmentArray): any {
    return this.http.post(local.reliquaryEndpoint, equipmentArray)
  }

  getAnyFlaws(number) {
    return this.http.get(local.srdBase + '/getRandomIB/' + number)
  }

  getFlaws() {
    return this.http.get(local.srdBase + '/getIBTables')
  }

}
