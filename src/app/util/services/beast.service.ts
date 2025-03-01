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
      Descriptions : {
        majSt: 5,
        minSt: 3,
        minWk: 1,
        majWk: 0
      },
      Convictions: {
        majSt: 4,
        minSt: 3,
        minWk: 2,
        majWk: 1
      },
      Devotions: {
        majSt: 8,
        minSt: 6,
        minWk: 4,
        majWk: 2
      }
    }
    const typeScalingBonus = {
      Descriptions: 1,
      Convictions: .1,
      Devotions: 1
    }

    const scaling = {
      majSt: 1,
      minSt: .75,
      minWk: .5,
      majWk: .25
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
      return Math.ceil(typeBase[type][strength] + ((scaling[strength] * typeScalingBonus[type]) * (ranks + adjustment)))
    }
  }

  calculateRankForSkill = (ranks, strength, adjustment = 0) => {
    const scaling = {
      majSt: 1.25,
      minSt: 1,
      minWk: .75,
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

  getDiceFromPoints (points) {
    const pointDiceDictionary = {
      0: '+0',
      3: '+0, roll twice; take highest',
      5: '+d10!',
      8: '+d10!, roll twice; take highest',
      10: '+d20!',
      13: '+d20!, roll twice; take highest',
      15: '+d20!+d10!',
      18: '+d20!+d10!, roll twice; take highest',
      20: '+2d20!',
      23: '+2d20!, roll twice; take highest',
      25: '+2d20!+d10!',
      28: '+2d20!+d10!, roll twice; take highest',
      30: '+3d20!',
      33: '+3d20!, roll twice; take highest',
      35: '+4d20!+d10!',
      38: '+4d20!+d10!, roll twice; take highest',
      40: '+3d20!'
    }
    return pointDiceDictionary[points]
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

  getSpellsForPleroma() {
    return this.http.get(local.endpointBase + '/api/spellsForPleroma')
    .pipe(tap(result => this.handleMessage(result)))
  }

  canAccessCustomCatalog() {
    return this.http.get(local.endpointBase + '/api/checkCustomCatalogAccess')
    .pipe(tap(result => this.handleMessage(result)))
  }

  getArtist(id) {
    return this.http.get(local.endpointBase + '/api/getArtist/' + id)
    .pipe(tap(result => this.handleMessage(result)))
  }

  searchName(name = null) {
    return this.http.get(local.endpointBase + '/api/searchName/' + name)
      .pipe(tap(result => this.handleMessage(result)))
  }

  searchObstacle(name = null) {
    return this.http.get(local.endpointBase + '/api/searchObstacle/' + name)
      .pipe(tap(result => this.handleMessage(result)))
  }

  searchChallenge(name = null) {
    return this.http.get(local.endpointBase + '/api/searchChallenge/' + name)
      .pipe(tap(result => this.handleMessage(result)))
  }

  checkIfCanEdit(id) {
    return this.http.get(local.endpointBase + '/api/canEdit/' + id)
      .pipe(tap(result => this.handleMessage(result)))
  }

  uploadMainImage = (imageForm: FormData, beastid: number | string) => {
    this.toastr.warning('', `Image Uploading`)
    return this.http.post(local.endpointBase + '/api/v1/upload/' + beastid, imageForm)
      .pipe(tap((result: any) => this.handleMessage(result.image ? { message: 'Image Uploaded', color: 'green' } : result)))
  }

  uploadTokenImage = (imageForm: FormData, beastid: number | string) => {
    this.toastr.warning('', `Token Uploading`)
    return this.http.post(local.endpointBase + '/api/v1/uploadToken/' + beastid, imageForm)
      .pipe(tap((result: any) => this.handleMessage(result.image ? { message: 'Token Uploaded', color: 'green' } : result)))
  }

  checkToken = (id: number | string) => {
    return this.http.get(local.endpointBase + '/api/checkToken/' + id)
      .pipe(tap(result => this.handleMessage(result)));
  }

  getCatalog(): any {
    return this.http.get(local.endpointBase + '/api/beasts/catalog')
      .pipe(tap(result => this.handleMessage(result)))
  }

  getCustomCatalog(): any {
    return this.http.get(local.endpointBase + '/api/customCatalog')
      .pipe(tap(result => this.handleMessage(result)))
  }

  getLists(): any {
    return this.http.get(local.endpointBase + '/api/getLists')
      .pipe(tap(result => this.handleMessage(result)))
  }

  getListsWithBeasts(): any {
    return this.http.get(local.endpointBase + '/api/getListsWithBeasts')
      .pipe(tap(result => this.handleMessage(result)))
  }

  getListByHash(listid): any {
    return this.http.get(local.endpointBase + '/api/getListByHash/' + listid)
      .pipe(tap(result => this.handleMessage(result)))
  }

  getRandomMonsterFromList(listid): any {
    return this.http.get(local.endpointBase + '/api/getRandomMonsterFromList/' + listid)
      .pipe(tap(result => this.handleMessage(result)))
  }

  addList(): any {
    return this.http.patch(local.endpointBase + '/api/addList', {})
      .pipe(tap(result => this.handleMessage(result)))
  }

  updateListName(changes): any {
    return this.http.patch(local.endpointBase + '/api/updateListName', changes)
      .pipe(tap(result => this.handleMessage(result)))
  }

  updateBeastRarity(changes): any {
    return this.http.patch(local.endpointBase + '/api/updateBeastRarity', changes)
      .pipe(tap(result => this.handleMessage(result)))
  }

  deleteBeastFromList(id): any {
    return this.http.delete(local.endpointBase + '/api/deleteBeastFromList/' + id)
      .pipe(tap(result => this.handleMessage(result)))
  }

  deleteList(id): any {
    return this.http.delete(local.endpointBase + '/api/deleteList/' + id)
      .pipe(tap(result => this.handleMessage(result)))
  }

  addBeastToList(body): any {
    return this.http.patch(local.endpointBase + '/api/addBeastToList', body)
      .pipe(tap(result => this.handleMessage(result)))
  }

  checkPlayerCanView(id): any {
    return this.http.get(local.endpointBase + '/api/playerCanView/' + id)
      .pipe(tap(result => this.handleMessage(result)))
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

  getQuickView(hash, body = null): any {
    return this.http.patch(`${local.endpointBase}/api/quickview/${hash}`, body)
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

  getItems(items): any {
    return this.http.post('https://reliquary.stone-fish.com/api/getItems?format=string', items)
      .pipe(tap(result => this.handleMessage(result)))
  }

  getTreasure(treasure): any {
    return this.http.post('https://reliquary.stone-fish.com/api/treasure', treasure)
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
    return this.http.post('https://reliquary.stone-fish.com/api/getRandomPotions?numberOfItems=' + number, null)
      .pipe(tap(result => this.handleMessage(result)))
  }

  getTalismans(number) {
    return this.http.post('https://reliquary.stone-fish.com/api/getTalismans?numberOfItems=' + number, null)
      .pipe(tap(result => this.handleMessage(result)))
  }

  getScrolls(number) {
    return this.http.post('https://reliquary.stone-fish.com/api/getScrolls?numberOfItems=' + number, null)
      .pipe(tap(result => this.handleMessage(result)))
  }

  getEnchantedItem() {
    return this.http.get('https://reliquary.stone-fish.com/api/getEnchantedItem')
      .pipe(tap(result => this.handleMessage(result)))
  }

}
