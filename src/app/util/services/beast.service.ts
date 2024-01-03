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

  public loggedIn: any = false
  public userId = null

  handleMessage(message) {
    let { message: info, color, error } = message;
    if (info) {
      if (color === 'green') {
        this.toastr.success(info)
      } else if (color === 'blue') {
        this.toastr.info(info)
      } else if (color === 'yellow') {
        this.toastr.warning(info)
      } else if (color === 'red') {
        this.toastr.error(info, null, { disableTimeOut: true })
        throw info
      }
    }
    if (error) {
      this.toastr.error(info)
      throw info
    }
  }

  handleError = (error: HttpErrorResponse) => {
    this.toastr.error(`Error: ${error.statusText}`)
    return throwError(() => new Error(`${error.statusText}`));
  }

  calculateRankForCharacteristic = (type, ranks, strength, adjustment = 0) => {
    const typeBase = {
      Convictions: 4,
      Descriptions: 4,
      Devotions: 4
    }
    const typeScalingBonus = {
      Convictions: 2.75,
      Descriptions: 1.33,
      Devotions: 2.75
    }

    const scaling = {
      majSt: 1.5,
      minSt: 1.25,
      minWk: .75,
      majWk: .5
    }

    if (strength === 'one') {
      return 1
    } else if (strength === 'noneStr') {
      return 5
    } else if (strength === 'noneWk') {
      return 0
    } else if (strength === 'none' || !strength) {
      return 3
    } else {
      return Math.ceil(typeBase[type] + ((scaling[strength] * typeScalingBonus[type]) * (ranks + adjustment)))
    }
  }

  calculateRankForSkill = (ranks, strength, adjustment = 0) => {
    const scaling = {
      majSt: 2,
      minSt: 1.5,
      minWk: 1,
      majWk: .5
    }

    const base = {
      majSt: 7,
      minSt: 5,
      minWk: 3,
      majWk: 1
    }

    if (strength === 'one') {
      return 1
    } else if (strength === 'noneStr') {
      return 5
    } else if (strength === 'noneWk') {
      return 0
    } else if (strength === 'none' || !strength) {
      return 3
    } else {
      return Math.ceil(base[strength] + (scaling[strength] * (ranks + adjustment)))
    }
  }

  checkLogin() {
    return this.http.get(local.endpointBase + '/api/auth/me').pipe(
      map((result: User) => {
        this.loggedIn = result
        if (result.id && result.patreon) {
          return result
        } else if (result.id) {
          return result;
        }
      })
    )
  }

  getArtist(id) {
    return this.http.get(local.endpointBase + '/api/getArtist/' + id)
    .pipe(tap(result => this.handleMessage(result)))
  }

  searchName(name = null) {
    return this.http.get(local.endpointBase + '/api/searchName/' + name)
      .pipe(tap(result => this.handleMessage(result)))
  }

  checkIfCanEdit(id) {
    return this.http.get(local.endpointBase + '/api/canEdit/' + id)
      .pipe(tap(result => this.handleMessage(result)))
  }

  uploadMainImage = (imageForm: FormData, id: number) => {
    this.toastr.warning('', `Image Uploading`)
    return this.http.post(local.endpointBase + '/api/v1/upload/' + id, imageForm)
      .pipe(tap(result => this.handleMessage(result)))
  }

  uploadTokenImage = (imageForm: FormData, id: number) => {
    this.toastr.warning('', `Token Uploading`)
    return this.http.post(local.endpointBase + '/api/v1/uploadToken/' + id, imageForm)
      .pipe(tap(result => this.handleMessage(result)))
  }

  checkToken = (id: number) => {
    return this.http.get(local.endpointBase + '/api/checkToken/' + id)
      .pipe(catchError(this.handleError));
  }

  getCatalog(): any {
    return this.http.get(local.endpointBase + '/api/beasts/catalog')
      .pipe(catchError(this.handleError))
  }

  getCustomCatalog(): any {
    return this.http.get(local.endpointBase + '/api/customCatalog')
      .pipe(catchError(this.handleError))
  }

  checkPlayerCanView(id): any {
    return this.http.get(local.endpointBase + '/api/playerCanView/' + id)
      .pipe(catchError(this.handleError))
  }

  getSingleBeast(id, edit): any {
    return this.http.get(local.endpointBase + '/api/beasts/' + id, { params: edit })
      .pipe(tap(result => this.handleMessage(result)));
  }

  getPlayerBeast(id): any {
    return this.http.get(local.endpointBase + '/api/beasts/player/' + id)
      .pipe(tap(result => this.handleMessage(result)))
  }

  updateBeast(beast): any {
    return this.http.patch(local.endpointBase + '/api/beasts/edit', beast)
      .pipe(tap(result => this.handleMessage(result)))
  }

  addBeast(beast): any {
    return this.http.post(local.endpointBase + '/api/beasts/add', beast)
      .pipe(tap(result => this.handleMessage(result)))
  }

  addPlayerNotes(notes): any {
    return this.http.post(local.endpointBase + '/api/beast/player', notes)
      .pipe(tap(result => this.handleMessage(result)))
  }

  addFavorite(beastid): any {
    return this.http.post(local.endpointBase + '/api/favorite', { beastid })
      .pipe(tap(result => this.handleMessage(result)))
  }

  deleteFavorite(beastid): any {
    return this.http.delete(local.endpointBase + '/api/favorite/' + beastid)
      .pipe(tap(result => this.handleMessage(result)))
  }

  getFavorites() {
    return this.http.get(local.endpointBase + '/api/favorites')
      .pipe(tap(result => this.handleMessage(result)))
  }

  deleteBeast(id): any {
    return this.http.delete(local.endpointBase + '/api/beasts/delete/' + id)
      .pipe(tap(result => this.handleMessage(result)))
  }

  searchBeasts(queries): any {
    return this.http.get(local.endpointBase + '/api/search', { params: queries })
      .pipe(tap(result => this.handleMessage(result)))
  }

  getEditEncounter(beastid) {
    return this.http.get(local.endpointBase + '/api/encounter/edit/' + beastid)
      .pipe(tap(result => this.handleMessage(result)))
  }

  getRandomEncounter(beastid, groupId) {
    return this.http.get(local.endpointBase + '/api/encounter/' + beastid, { params: { groupId } })
      .pipe(tap(result => this.handleMessage(result)))
  }

  getRandomMonster(): any {
    return this.http.get(local.endpointBase + '/api/randomMonster')
      .pipe(tap(result => this.handleMessage(result)))
  }

  getQuickView(hash): any {
    return this.http.get(`${local.endpointBase}/api/quickview/${hash}`)
      .pipe(tap(result => this.handleMessage(result)))
  }

  getEquipment(): any {
    return this.http.get(`${local.endpointBase}/api/equipment`)
      .pipe(tap(result => this.handleMessage(result)))
  }

  getCombatSquare(combatStats, role, points, size): any {
    return this.http.patch(local.endpointBase + '/api/combatSquare', { combatStats, role, points, size })
      .pipe(tap(result => this.handleMessage(result)))
  }

  getMovement(movements): any {
    return this.http.patch(local.endpointBase + '/api/movement', { movements })
      .pipe(tap(result => this.handleMessage(result)))
  }

  getVitalityAndStress(points, mentalpoints, role, combatStats, secondaryrole, knockback, size, armor, shield): any {
    return this.http.patch(local.endpointBase + '/api/vitalityAndStress', { points, mentalpoints, role, combatStats, secondaryrole, knockback, size, armor, shield })
      .pipe(tap(result => this.handleMessage(result)))
  }

  getUniqueEquipment(equipmentArray): any {
    return this.http.post(local.reliquaryEndpoint, equipmentArray)
      .pipe(tap(result => this.handleMessage(result)))
  }

  getAnyBurdens(number) {
    return this.http.get(local.srdBase + '/getRandomIB/' + number)
      .pipe(tap(result => this.handleMessage(result)))
  }

  getAnyFlaws(number) {
    return this.http.get(local.srdBase + '/getRandomFlaws/' + number)
      .pipe(tap(result => this.handleMessage(result)))
  }

  getBurdens() {
    return this.http.get(local.srdBase + '/getIBTables')
      .pipe(tap(result => this.handleMessage(result)))
  }

  getAllClimates() {
    return this.http.get(local.endpointBase + '/api/getAllClimates')
      .pipe(tap(result => this.handleMessage(result)))
  }

  getPotions(number) {
    return this.http.post('https://reliquary.dragon-slayer.net/api/getRandomPotions?numberOfItems=' + number, null)
      .pipe(tap(result => this.handleMessage(result)))
  }

  getTalismans(number) {
    return this.http.post('https://reliquary.dragon-slayer.net/api/getTalismans?numberOfItems=' + number, null)
      .pipe(tap(result => this.handleMessage(result)))
  }

  getScrolls(number) {
    return this.http.post('https://reliquary.dragon-slayer.net/api/getScrolls?numberOfItems=' + number, null)
      .pipe(tap(result => this.handleMessage(result)))
  }

  getEnchantedItem() {
    return this.http.get('https://reliquary.dragon-slayer.net/api/getEnchantedItem')
      .pipe(tap(result => this.handleMessage(result)))
  }

}
