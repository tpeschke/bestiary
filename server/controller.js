const {consoleLogErrorNoFile, sendErrorForwardNoFile, checkForContentTypeBeforeSending} = require('./helpers')

const consoleLogError = consoleLogErrorNoFile('controller')
const sendErrorForward = sendErrorForwardNoFile('controller')

let rollDice = function (diceString) {
  if (typeof (diceString) === 'number') {
    if (+diceString === 0) {
      return 0
    }
    return +Math.floor(Math.random() * Math.floor(diceString)) + 1
  } else {
    let diceExpressionArray = []
    let expressionValue = ""

    diceString.replace(/\s/g, '').split('').forEach((val, i, array) => {
      if (val === '-' || val === '+' || val === '*') {
        diceExpressionArray.push(expressionValue)
        if (i !== array.length - 1) {
          diceExpressionArray.push(val)
        }
        expressionValue = ""
      }
      if (!isNaN(+val) || val === 'd' || val === "!") {
        val = val.replace(/!/i, "")
        expressionValue = expressionValue + val;
      }

      if (i === array.length - 1 && expressionValue !== '') {
        diceExpressionArray.push(expressionValue);
      }
    })

    for (let index = 0; index < diceExpressionArray.length; index++) {
      let val = diceExpressionArray[index];

      if (val.includes('d')) {
        val = val.split('d')
        let subtotal = 0
        if (val[0] === "") { val[0] = 1 }
        for (let i = 0; i < +val[0]; i++) {
          subtotal += rollDice(+val[1])
        }
        diceExpressionArray[index] = subtotal
      }
    }

    return eval(diceExpressionArray.join(""))
  }
}

function getRandomEncounter(label, numbers, weights) {
  let rolesGoodToAdd = {}
  let randomEncounterRoles = {}
  weights.forEach(entry => {
    rolesGoodToAdd[entry.role] = true
  })

  let roleLoopTimes = 1
  let totalNumber = rollDice(numbers[0].numbers)
  if (totalNumber < 1) { totalNumber = 1 }

  for (i = 1; i <= totalNumber; i++) {
    const entry = weights[Math.floor(Math.random() * weights.length)];

    if (randomEncounterRoles[entry.role] && rolesGoodToAdd[entry.role]) {
      randomEncounterRoles[entry.role] += 1
      if (randomEncounterRoles[entry.role] === (entry.weight * roleLoopTimes)) {
        rolesGoodToAdd[entry.role] = false
      }
    } else if (!randomEncounterRoles[entry.role] && rolesGoodToAdd[entry.role]) {
      randomEncounterRoles[entry.role] = 1
      if (randomEncounterRoles[entry.role] === (entry.weight * roleLoopTimes)) {
        rolesGoodToAdd[entry.role] = false
      }
    } else if (!rolesGoodToAdd[entry.role]) {
      let allRolesFalse = true
      for (key in rolesGoodToAdd) {
        if (rolesGoodToAdd[key]) {
          allRolesFalse = false
        }
      }

      if (allRolesFalse) {
        for (let key in rolesGoodToAdd) {
          rolesGoodToAdd[key] = true
        }
        roleLoopTimes++
      } else {
        --i
      }
    }
  }

  let milesFromLair = rollDice(numbers[0].miles)
  if (milesFromLair < 0) { milesFromLair = 1 }

  return {
    monsterRoles: randomEncounterRoles,
    label,
    milesFromLair,
    totalNumber
  }
}

let controllerObj = {
  catalogCache: [],
  newCache: [],
  createHash() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  },
  collectCatelog(app) {
    const db = app.get('db')
    db.get.catalogallview().then(result => {
      let finalArray = []
      if (result.length > 0) {
        this.newCache.push(result)
      }

      result = result.map(beast => {
        finalArray.push(db.get.rolesforcatalog(beast.id).then(result => {
          beast.roles = result
          if (!beast.defaultrole && beast.roles.length > 0) {
            beast.defaultrole = beast.roles[0].id
          }
          if (beast.defaultrole) {
            for (let i = 0; i < beast.roles.length; i++) {
              if (beast.roles[i].id === beast.defaultrole) {
                beast.role = beast.roles[i].role
                beast.secondaryrole = beast.roles[i].secondaryrole
                beast.socialrole = beast.roles[i].socialrole
                beast.skillrole = beast.roles[i].skillrole
                i = beast.roles.length
              }
            }
          }
          return result
        }).catch(e => consoleLogError('get roles for catalog', e)))
      })

      Promise.all(finalArray).then(_ => {
        db.get.catalogtemplates().then(result => {
          let finalArray = []
          if (result.length > 0) {
            this.newCache.push(result)
          }

          result = result.map(beast => {
            finalArray.push(db.get.rolesfortemplatecatalog(beast.id).then(result => {
              beast.roles = result
              if (!beast.defaultrole && beast.roles.length > 0) {
                beast.defaultrole = beast.roles[0].id
              }
              if (beast.defaultrole) {
                for (let i = 0; i < beast.roles.length; i++) {
                  if (beast.roles[i].id === beast.defaultrole) {
                    beast.role = beast.roles[i].role
                    beast.secondaryrole = beast.roles[i].secondaryrole
                    beast.socialrole = beast.roles[i].socialrole
                    beast.skillrole = beast.roles[i].skillrole
                    i = beast.roles.length
                  }
                }
              }
              return result
            }).catch(e => consoleLogError('collect roles for templates', e)))
          })

          Promise.all(finalArray).then(_ => {
            this.collectCache(app, 0)
          }).catch(e => consoleLogError('catalog final promise', e))
        }).catch(e => consoleLogError('templates catagory', e))
      }).catch(e => consoleLogError('collect catagory promise', e))
    }).catch(e => consoleLogError('collect catagory outer', e))
  },
  collectCache(app, index) {
    const db = app.get('db')
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    if (alphabet[index]) {
      db.get.catalogbyletter(alphabet[index]).then(result => {
        let finalArray = []
        if (result.length > 0) {
          this.newCache.push(result)
        }

        result = result.map(beast => {
          finalArray.push(db.get.rolesforcatalog(beast.id).then(result => {
            beast.roles = result
            if (!beast.defaultrole && beast.roles.length > 0) {
              beast.defaultrole = beast.roles[0].id
            }
            if (beast.defaultrole) {
              for (let i = 0; i < beast.roles.length; i++) {
                if (beast.roles[i].id === beast.defaultrole) {
                  beast.role = beast.roles[i].role
                  beast.secondaryrole = beast.roles[i].secondaryrole
                  beast.socialrole = beast.roles[i].socialrole
                  beast.skillrole = beast.roles[i].skillrole
                  i = beast.roles.length
                }
              }
            }
            return result
          }).catch(e => consoleLogError('roles for catalog by alpha', e)))
        })

        Promise.all(finalArray).then(_ => {
          this.collectCache(app, ++index)
        }).catch(e => consoleLogError('collect cache final promise', e))
      }).catch(e => consoleLogError('catalog by letter', e))
    } else {
      this.catalogCache = this.newCache
      this.newCache = []
      console.log('bestiary catalog collected')
    }
  },
  // BEAST ENDPOINTS
  checkIfPlayerView(req, res) {
    const db = req.app.get('db')
      , id = +req.params.id

    db.get.playercanview(id).then(result => {
      checkForContentTypeBeforeSending(res, { canView: (req.user && req.user.id === 1) || (req.user && req.user.patreon >= 3) || result[0].canplayerview })
    }).catch(e => sendErrorForward('player can view', e, res))
  },
  getPlayerBeast(req, res) {
    const db = req.app.get('db')
      , id = +req.params.id
    db.get.playerVersion(id).then(result => {
      if (req.user) {
        db.get.beastnotes(id, req.user.id).then(notes => {
          result = result[0]
          result.notes = notes[0] || {}
          checkForContentTypeBeforeSending(res, result)
        }).catch(e => sendErrorForward('player version notes', e, res))
      } else {
        checkForContentTypeBeforeSending(res, result)
      }
    }).catch(e => sendErrorForward('player version', e, res))
  },
  addPlayerNotes(req, res) {
    const db = req.app.get('db')
      , { beastId, noteId, notes } = req.body

    if (req.user) {
      if (noteId) {
        db.update.beastnotes(noteId, notes).then(result => {
          checkForContentTypeBeforeSending(res, result[0])
        }).catch(e => sendErrorForward('update beast notes', e, res))
      } else {
        db.get.usernotecount(req.user.id).then(count => {
          count = count[0]
          if (count >= 50 || count >= (req.user.patreon * 30) + 50) {
            res.status(401).send('You need to upgrade your Patreon to add more notes')
          } else {
            db.add.beastnotes(beastId, req.user.id, notes).then(result => {
              checkForContentTypeBeforeSending(res, result[0])
            }).catch(e => sendErrorForward('save beast notes', e, res))
          }
        }).catch(e => sendErrorForward('check user note count', e, res))
      }
    } else {
      res.sendStatus(401)
    }
  },
  addBeast({ body, app }, res) {
    const db = app.get('db')
    let { name, hr, intro, climates, habitat, ecology, number_min, number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, subsystem, patreon, vitality, panic, stress, types, movement, conflict, skills, variants, loot, reagents, lootnotes, traitlimit, devotionlimit, flawlimit, passionlimit, encounter, plural, thumbnail, rarity, locationalvitality, lairloot, roles, casting, spells, deletedSpellList, challenges, obstacles, caution, role, combatpoints, socialrole, socialpoints, secondaryrole, skillrole, skillpoints, fatigue, artistInfo, defaultrole, socialsecondary, notrauma, carriedloot, folklore, combatStatArray, knockback, singledievitality, noknockback, tables, rolenameorder, descriptionshare, convictionshare, devotionshare } = body

    db.add.beast(name, hr, intro, habitat, ecology, +number_min, +number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, +subsystem, +patreon, vitality, panic, +stress, controllerObj.createHash(), lootnotes, +traitlimit > 0 ? +traitlimit : null, +devotionlimit > 0 ? +devotionlimit : null, +flawlimit > 0 ? +flawlimit : null, +passionlimit > 0 ? +passionlimit : null, plural, thumbnail, rarity, caution, role, combatpoints, socialrole, socialpoints, secondaryrole, skillrole, skillpoints, fatigue, defaultrole, socialsecondary, notrauma, knockback, singledievitality, noknockback, rolenameorder, descriptionshare, convictionshare, devotionshare).then(result => {
      let id = result[0].id
        , promiseArray = []

      promiseArray.push(db.delete.roles([id, ['', ...roles.map(roles => roles.id)]]).then(_ => {
        return roles.map(({ id: roleid, vitality, hash, name, role, attack, defense, secondaryrole, combatpoints, stress, panic, caution, socialrole, socialpoints, skillrole, skillpoints, socialsecondary, size, fatigue, largeweapons, mental, knockback, singledievitality, noknockback }) => {
          if (!hash) {
            hash = controllerObj.createHash()
          }
          return db.add.beastroles(roleid, id, vitality, hash, name, role, attack, defense, secondaryrole, combatpoints, stress, panic, caution, socialrole, socialpoints, skillrole, skillpoints, socialsecondary, size, fatigue, largeweapons, mental, knockback, singledievitality, noknockback).catch(e => console.log("add roles ~ ", e))
        })
      }).catch(e => sendErrorForward('add beast delete roles', e, res)))
      types.forEach(val => {
        promiseArray.push(db.add.beasttype(id, val.typeid).then().catch(e => sendErrorForward('add beast types', e, res)))
      })

      // update climate
      climates.beast.forEach(val => {
        if (val.deleted) {
          promiseArray.push(db.delete.climate.climate(val.uniqueid).catch(e => sendErrorForward('add beast delete climate', e, res)))
        } else if (!val.uniqueid) {
          promiseArray.push(db.add.climate(id, val.climateid).catch(e => sendErrorForward('add beast add climate', e, res)))
        }
      })

// COMBAT STAT ADD
      promiseArray.push(db.delete.combatStats([id, [0, ...combatStatArray.map(combatStat => combatStat.id)]]).then(_ => {
        return combatStatArray.map(({ id: uniqueid, roleid, piercingweapons, slashingweapons, crushingweapons, weaponsmallslashing,
          weaponsmallcrushing, weaponsmallpiercing, andslashing, andcrushing, flanks, rangeddefence, alldefense, allaround, armorandshields,
          unarmored, attack, isspecial, eua, addsizemod, weapon, shield, armor, weaponname, rangeddefense, initiative, measure, recovery, showonlydefenses, weapontype, rangedistance, swarmbonus, adjustment, tdr }) => {
          if (!uniqueid) {
            return db.add.combatStats(id, roleid, piercingweapons, slashingweapons, crushingweapons, weaponsmallslashing,
              weaponsmallcrushing, weaponsmallpiercing, andslashing, andcrushing, flanks, rangeddefence, alldefense, allaround, armorandshields,
              unarmored, attack, isspecial, eua, addsizemod, weapon, shield, armor, weaponname, rangeddefense, initiative, measure, recovery, showonlydefenses, weapontype, rangedistance, swarmbonus, adjustment, tdr )
          } else {
            return db.update.combatStats(uniqueid, id, roleid, piercingweapons, slashingweapons, crushingweapons, weaponsmallslashing,
              weaponsmallcrushing, weaponsmallpiercing, andslashing, andcrushing, flanks, rangeddefence, alldefense, allaround, armorandshields,
              unarmored, attack, isspecial, eua, addsizemod, weapon, shield, armor, weaponname, rangeddefense, initiative, measure, recovery, showonlydefenses, weapontype, rangedistance, swarmbonus, adjustment, tdr )
          }
        })
      }).catch(e => sendErrorForward('add beast combat stats', e, res)))

      let newConflict = []
      Object.keys(conflict).forEach(key => newConflict = [...newConflict, ...conflict[key]])
      newConflict.forEach(({ trait, value, type, socialroleid, allroles, severity, strength, adjustment }) => {
        promiseArray.push(db.add.beastconflict(id, trait, value, type, socialroleid, allroles, severity, strength, adjustment).then().catch(e => sendErrorForward('add beast conflict', e, res)))
      })
      skills.forEach(({ skill, rank, skillroleid, allroles, strength, adjustment }) => {
        promiseArray.push(db.add.beastskill(id, skill, rank, skillroleid, allroles, strength, adjustment).then().catch(e => sendErrorForward('add beast skills', e, res)))
      })
      movement.forEach(({ stroll, walk, jog, run, sprint, type, roleid, allroles, strollstrength, walkstrength, jogstrength, runstrength, sprintstrength, adjustment }) => {
        promiseArray.push(db.add.beastmovement(id, stroll, walk, jog, run, sprint, type, roleid, allroles, strollstrength, walkstrength, jogstrength, runstrength, sprintstrength, adjustment).then().catch(e => sendErrorForward('add beast movement', e, res)))
      })
      variants.forEach(({ variantid }) => {
        promiseArray.push(db.add.beastvariants(id, variantid).then().catch(e => sendErrorForward('add beast variant 1', e, res)))
        promiseArray.push(db.add.beastvariants(variantid, id).then().catch(e => sendErrorForward('add beast variant 2', e, res)))
      })
      loot.forEach(({ loot, price }) => {
        promiseArray.push(db.add.beastloot(id, loot, price).then().catch(e => sendErrorForward('add beast loot', e, res)))
      })
      reagents.forEach(({ name, spell, difficulty, harvest }) => {
        promiseArray.push(db.add.beastreagents(id, name, spell, difficulty, harvest).then().catch(e => sendErrorForward('add beast reagents', e, res)))
      })

      let { id: dbid, artistid, artist, tooltip, link } = artistInfo;
      if (artist) {
        if (!artistid) {
          promiseArray.push(db.add.allartists(artist, tooltip, link).then(result => {
            return promiseArray.push(db.add.artist(id, result[0].id).then(result => result).catch(e => sendErrorForward('add beast add artist', e, res)))
          }).catch(e => sendErrorForward('add beast all artists', e, res)))
        } else {
          promiseArray.push(db.add.artist(id, artistid).then(result => result).catch(e => sendErrorForward('add beast add artist 2', e, res)))
        }
      }

      let {appearance, habitat, attack, defense} = tables
      appearance.forEach(table => {
        if (table.id) {
          promiseArray.push(db.update.alltables(table.id, table.label).then().catch(e => sendErrorForward('add beast appearance all tables', e, res)))
          db.delete.rows([table.id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
            table.rows.forEach(({weight, value, id: rowid}) => {
                promiseArray.push(db.add.row(rowid, table.id, weight, value).then().catch(e => sendErrorForward('add beast add appearnce table row', e, res)))
            })
          }).catch(e => sendErrorForward('add beast delete apperance table rows', e, res))
        } else {
          promiseArray.push(db.add.alltables(table.label, 'ap').then(result => {
            promiseArray.push(db.add.table(id, result[0].id))
            db.delete.rows([result[0].id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
              table.rows.forEach(({weight, value, id: rowid}) => {
                promiseArray.push(db.add.row(rowid, result[0].id, weight, value).then().catch(e => sendErrorForward('add beast add appearance table add rows 2', e, res)))
              })
            }).catch(e => sendErrorForward('add beast add appearance table add rows', e, res))
          }).catch(e => sendErrorForward('add beast add appearance table', e, res)))
        }
      })
      habitat.forEach(table => {
        if (table.id) {
          promiseArray.push(db.update.alltables(table.id, table.label).then().catch(e => sendErrorForward('add beast habitat all tables', e, res)))
          db.delete.rows([table.id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
            table.rows.forEach(({weight, value, id: rowid}) => {
                promiseArray.push(db.add.row(rowid, table.id, weight, value).then().catch(e => sendErrorForward('add beast add habitat rows', e, res)))
            })
          }).catch(e => sendErrorForward('add beast add habitat table delete rows', e, res))
        } else {
          promiseArray.push(db.add.alltables(table.label, 'ha').then(result => {
            promiseArray.push(db.add.table(id, result[0].id))
            db.delete.rows([result[0].id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
              table.rows.forEach(({weight, value, id: rowid}) => {
                promiseArray.push(db.add.row(rowid, result[0].id, weight, value).then().catch(e => sendErrorForward('add beast add habitat add rows', e, res)))
              })
            }).catch(e => sendErrorForward('add beast habitat delete rows', e, res))
          }).catch(e => sendErrorForward('add beast add habitat table', e, res)))
        }
      })
      attack.forEach(table => {
        if (table.id) {
          promiseArray.push(db.update.alltables(table.id, table.label).then().catch(e => sendErrorForward('add beast attack table all tables', e, res)))
          db.delete.rows([table.id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
            table.rows.forEach(({weight, value, id: rowid}) => {
                promiseArray.push(db.add.row(rowid, table.id, weight, value).then().catch(e => sendErrorForward('add beast add attack table add rows', e, res)))
            })
          }).catch(e => sendErrorForward('add beast add attack table delete rows', e, res))
        } else {
          promiseArray.push(db.add.alltables(table.label, 'at').then(result => {
            promiseArray.push(db.add.table(id, result[0].id))
            db.delete.rows([result[0].id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
              table.rows.forEach(({weight, value, id: rowid}) => {
                promiseArray.push(db.add.row(rowid, result[0].id, weight, value).then().catch(e => sendErrorForward('add beast add attack table delete rows 3', e, res)))
              })
            }).catch(e => sendErrorForward('add beast add attack table delete rows 2', e, res))
          }).catch(e => sendErrorForward('add beast add attack table all table', e, res)))
        }
      })
      defense.forEach(table => {
        if (table.id) {
          promiseArray.push(db.update.alltables(table.id, table.label).then().catch(e => sendErrorForward('add beast add defense table all tables', e, res)))
          db.delete.rows([table.id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
            table.rows.forEach(({weight, value, id: rowid}) => {
                promiseArray.push(db.add.row(rowid, table.id, weight, value).then().catch(e => sendErrorForward('add beast add defense table add rows', e, res)))
            })
          }).catch(e => sendErrorForward('add beast add defence table delete rows', e, res))
        } else {
          promiseArray.push(db.add.alltables(table.label, 'de').then(result => {
            promiseArray.push(db.add.table(id, result[0].id))
            db.delete.rows([result[0].id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
              table.rows.forEach(({weight, value, id: rowid}) => {
                promiseArray.push(db.add.row(rowid, result[0].id, weight, value).then().catch(e => sendErrorForward('add beast add defnes table  more rows', e, res)))
              })
            }).catch(e => sendErrorForward('add beast add defense table delete rows', e, res))
          }).catch(e => sendErrorForward('add beast add defense table all table label', e, res)))
        }
      })

      let { temperament, rank, verb, noun, signs, numbers, groups } = encounter;
      temperament.temperament.forEach(({ temperament: temp, weight, id: tempid, beastid, tooltip, deleted, temperamentid }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.temperament(beastid, tempid).catch(e => sendErrorForward('add beast delete temp', e, res)))
        } else if ((tempid && !beastid) || (tempid && beastid !== id)) {
          promiseArray.push(db.add.encounter.temperament(id, tempid, weight).catch(e => sendErrorForward('add beast add temp', e, res)))
        } else if (tempid && beastid) {
          promiseArray.push(db.update.encounter.temperament(weight, beastid, tempid).catch(e => sendErrorForward('add beast update temp', e, res)))
        } else if (!tempid) {
          db.add.encounter.allTemp(temp, tooltip).then(result => {
            promiseArray.push(db.add.encounter.temperament(id, result[0].id, weight).catch(e => sendErrorForward('add beast add temp w/ weight', e, res)))
          }).catch(e => sendErrorForward('add beast all temp', e, res))
        }
      })

      groups.forEach(({ id: groupid, beastid, deleted, label, weights, weight }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.groups(id, groupid).then(_ => db.delete.encounter.groupRoles(beastid, groupid).catch(e => sendErrorForward('add beast delete group roles', e, res))).catch(e => sendErrorForward('add beast delete groups', e, res)))
        } else if (groupid && beastid) {
          promiseArray.push(db.update.encounter.groups(id, groupid, label, +weight).then(_ => {
            let groupPromises = []

            weights.forEach(({ id: roleid, weight: roleweight, role }) => {
              if (roleid) {
                groupPromises.push(db.update.encounter.groupRoles(beastid, roleid, groupid, +roleweight, role).catch(e => sendErrorForward('add beast update group role', e, res)))
              } else {
                groupPromises.push(db.add.encounter.groupRoles(beastid, groupid, +roleweight, role).catch(e => sendErrorForward('add beast add group role', e, res)))
              }
            })
            return Promise.all(groupPromises)
          }).catch(e => sendErrorForward('add beast update group', e, res)))
        } else if (!groupid) {
          promiseArray.push(db.add.encounter.groups(id, label, +weight).then(result => {
            let groupPromises = []

            groupid = result[0].id
            weights.forEach(({ id: roleid, weight: roleweight, role }) => {
              if (roleid) {
                groupPromises.push(db.update.encounter.groupRoles(id, roleid, groupid, +roleweight, role).catch(e => sendErrorForward('add beast update group role', e, res)))
              } else {
                groupPromises.push(db.add.encounter.groupRoles(id, groupid, +roleweight, role).catch(e => sendErrorForward('add beast add group role', e, res)))
              }
            })
            return Promise.all(groupPromises)
          }).catch(e => sendErrorForward('add beast add group', e, res)))
        }
      })

      numbers.forEach(({ id: numberid, beastid, deleted, numbers, miles, weight }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.numbers(id, numberid).catch(e => sendErrorForward('add beast delete numbers', e, res)))
        } else if (numberid && beastid) {
          promiseArray.push(db.update.encounter.numbers(beastid, numberid, numbers, miles, +weight).catch(e => sendErrorForward('add beast update numbers', e, res)))
        } else if (!numberid) {
          promiseArray.push(db.add.encounter.numbers(id, numbers, miles, +weight).catch(e => sendErrorForward('add beast add numbers', e, res)))
        }
      })

      signs.signs.forEach(({ sign, weight, id: signid, beastid, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.signs(beastid, signid).catch(e => sendErrorForward('add beast delete sign', e, res)))
        } else if ((signid && !beastid) || (signid && beastid !== id)) {
          promiseArray.push(db.add.encounter.sign(id, signid, weight).catch(e => sendErrorForward('add beast add sign', e, res)))
        } else if (signid && beastid) {
          promiseArray.push(db.update.encounter.signs(weight, beastid, signid).catch(e => sendErrorForward('add beast update sign', e, res)))
        } else if (!signid) {
          db.add.encounter.allSigns(sign).then(result => {
            promiseArray.push(db.add.encounter.sign(id, result[0].id, weight).catch(e => sendErrorForward('add beast add sign w/ weight', e, res)))
          }).catch(e => sendErrorForward('add beast all signs', e, res))
        }
      })

      verb.verb.forEach(({ verb, id: verbid, beastid, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.verb(beastid, verbid).catch(e => sendErrorForward('add beast delete verb', e, res)))
        } else if ((verbid && !beastid) || (verbid && beastid !== id)) {
          promiseArray.push(db.add.encounter.verb(verbid, id).catch(e => sendErrorForward('add beast add verb', e, res)))
        } else if (!verbid) {
          db.add.encounter.allVerb(verb).then(result => {
            promiseArray.push(db.add.encounter.verb(result[0].id, id).catch(e => sendErrorForward('add beast add verb 2', e, res)))
          }).catch(e => sendErrorForward('add beast all verbs', e, res))
        }
      })

      noun.noun.forEach(({ noun, id: nounid, beastid, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.noun(beastid, nounid).catch(e => sendErrorForward('add beast delete noun', e, res)))
        } else if ((nounid && !beastid) || (nounid && beastid !== id)) {
          promiseArray.push(db.add.encounter.noun(nounid, id).catch(e => sendErrorForward('add beast add noun', e, res)))
        } else if (!nounid) {
          db.add.encounter.allNoun(noun).then(result => { 
            promiseArray.push(db.add.encounter.noun(result[0].id, id).catch(e => sendErrorForward('add beast add noun 2', e, res)))
          }).catch(e => sendErrorForward('add beast all nouns', e, res))
        }
      })

      locationalvitality.forEach(({ id: locationid, location, vitality, beastid, roleid, allroles }) => {
        if (deleted) {
          promiseArray.push(db.delete.locationalvitality(beastid, locationid).catch(e => sendErrorForward('add beast delete locational vitality', e, res)))
        } else if (locationid && beastid) {
          promiseArray.push(db.update.locationalvitality(beastid, location, vitality, locationid, roleid, allroles).catch(e => sendErrorForward('add beast update locational vitality', e, res)))
        } else {
          promiseArray.push(db.add.locationalvitality(beastid, locationid, vitality, allroles, roleid).catch(e => sendErrorForward('add beast add locational vitality', e, res)))
        }
      })

      let { beastid, copper, silver, gold, potion, relic, enchanted, equipment, traited, scrolls, alms, talisman } = lairloot
      if (!beastid) {
        promiseArray.push(db.add.loot.lairbasic(id, copper, silver, gold, potion, relic, enchanted, talisman).catch(e => sendErrorForward('add beast add loot basic', e, res)))
      } else {
        promiseArray.push(db.update.loot.lairbasic(beastid, copper, silver, gold, potion, relic, enchanted, talisman).catch(e => sendErrorForward('add beast update loot basic', e, res)))
      }

      if (equipment) {
        equipment.forEach(({ id: equipid, beastid, value, number, deleted }) => {
          if (deleted) {
            promiseArray.push(db.delete.loot.lairequipment(beastid, equipid).catch(e => sendErrorForward('add beast delete equipment', e, res)))
          } else if (equipid && beastid) {
            promiseArray.push(db.update.loot.lairequipment(equipid, value, number).catch(e => sendErrorForward('add beast update equipment', e, res)))
          } else {
            promiseArray.push(db.add.loot.lairequipment(id, value, number).catch(e => sendErrorForward('add beast add equipment', e, res)))
          }
        })
      }

      if (traited) {
        traited.forEach(({ id: traitedid, beastid, value, chancetable, deleted }) => {
          if (deleted) {
            promiseArray.push(db.delete.loot.lairtraited(beastid, traitedid).catch(e => sendErrorForward('add beast delete traited equipment', e, res)))
          } else if (traitedid && beastid) {
            promiseArray.push(db.update.loot.lairtraited(traitedid, value, chancetable).catch(e => sendErrorForward('add beast update traited equipment', e, res)))
          } else {
            promiseArray.push(db.add.loot.lairtraited(id, value, chancetable).catch(e => sendErrorForward('add beast add traited equipment', e, res)))
          }
        })
      }

      if (scrolls) {
        scrolls.forEach(({ id: scrollid, beastid, number, power, deleted }) => {
          if (deleted) {
            promiseArray.push(db.delete.loot.lairscrolls(beastid, scrollid).catch(e => sendErrorForward('add beast delete scrolls', e, res)))
          } else if (scrollid && beastid) {
            promiseArray.push(db.update.loot.lairscrolls(scrollid, number, power).catch(e => sendErrorForward('add beast update scrolls', e, res)))
          } else {
            promiseArray.push(db.add.loot.lairscrolls(id, number, power).catch(e => sendErrorForward('add beast add scrolls', e, res)))
          }
        })
      }

      if (alms) {
        alms.forEach(({ id: almid, beastid, number, favor, deleted }) => {
          if (deleted) {
            promiseArray.push(db.delete.loot.lairalms(beastid, almid).catch(e => sendErrorForward('add beast delete alms', e, res)))
          } else if (almid && beastid) {
            promiseArray.push(db.update.loot.lairalms(almid, number, favor).catch(e => sendErrorForward('add beast update alms', e, res)))
          } else {
            promiseArray.push(db.add.loot.lairalms(id, number, favor).catch(e => sendErrorForward('add beast add alms', e, res)))
          }
        })
      }


      let { beastid: cbeastid, copper: ccopper, silver: csilver, gold: cgold, potion: cpotion, relic: crelic, enchanted: cenchanted, equipment: cequipment, traited: ctraited, scrolls: cscrolls, alms: calms, talisman: ctalisman } = carriedloot
      if (!cbeastid) {
        promiseArray.push(db.add.loot.carriedbasic(id, ccopper, csilver, cgold, cpotion, crelic, cenchanted, ctalisman).catch(e => sendErrorForward('add beast add basic loot', e, res)))
      } else {
        promiseArray.push(db.update.loot.carriedbasic(cbeastid, ccopper, csilver, cgold, cpotion, crelic, cenchanted, ctalisman).catch(e => sendErrorForward('add beast update basic loot', e, res)))
      }

      if (cequipment) {
        cequipment.forEach(({ id: equipid, beastid, value, number, deleted }) => {
          if (deleted) {
            promiseArray.push(db.delete.loot.carriedequipment(cbeastid, equipid).catch(e => sendErrorForward('add beast delete carried equipment', e, res)))
          } else if (equipid && cbeastid) {
            promiseArray.push(db.update.loot.carriedequipment(equipid, value, number).catch(e => sendErrorForward('add beast update carried equipment', e, res)))
          } else {
            promiseArray.push(db.add.loot.carriedequipment(id, value, number).catch(e => sendErrorForward('add beast add carried equipment', e, res)))
          }
        })
      }

      if (ctraited) {
        ctraited.forEach(({ id: traitedid, beastid, value, chancetable, deleted }) => {
          if (deleted) {
            promiseArray.push(db.delete.loot.carriedtraited(cbeastid, traitedid).catch(e => sendErrorForward('add beast delete carried traited equipment', e, res)))
          } else if (traitedid && cbeastid) {
            promiseArray.push(db.update.loot.carriedtraited(traitedid, value, chancetable).catch(e => sendErrorForward('add beast update carried traited equipment', e, res)))
          } else {
            promiseArray.push(db.add.loot.carriedtraited(id, value, chancetable).catch(e => sendErrorForward('add beast add carried traited equipment', e, res)))
          }
        })
      }

      if (cscrolls) {
        cscrolls.forEach(({ id: scrollid, beastid, number, power, deleted }) => {
          if (deleted) {
            promiseArray.push(db.delete.loot.carriedscrolls(cbeastid, scrollid).catch(e => sendErrorForward('add beast delete carried scrolls', e, res)))
          } else if (scrollid && cbeastid) {
            promiseArray.push(db.update.loot.carriedscrolls(scrollid, number, power).catch(e => sendErrorForward('add beast update carried scrolls', e, res)))
          } else {
            promiseArray.push(db.add.loot.carriedscrolls(id, number, power).catch(e => sendErrorForward('add beast add carried scrolls', e, res)))
          }
        })
      }

      if (calms) {
        calms.forEach(({ id: almid, beastid, number, favor, deleted }) => {
          if (deleted) {
            promiseArray.push(db.delete.loot.carriedalms(cbeastid, almid).catch(e => sendErrorForward('add beast delete carried alms', e, res)))
          } else if (almid && cbeastid) {
            promiseArray.push(db.update.loot.carriedalms(almid, number, favor).catch(e => sendErrorForward('add beast update carried alms', e, res)))
          } else {
            promiseArray.push(db.add.loot.carriedalms(id, number, favor).catch(e => sendErrorForward('add beast add carried alms', e, res)))
          }
        })
      }

      if (casting) {
        let { augur, wild, vancian, spellnumberdie, manifesting, commanding, bloodpact, defaulttype } = casting
        promiseArray.push(db.update.casting(augur, wild, vancian, spellnumberdie, manifesting, commanding, bloodpact, defaulttype, id).catch(e => sendErrorForward('add beast add beast casting', e, res)))
      }

      if (spells) {
        spells.forEach(({ id: spellid, name, origin, shape, range, interval, effect, beastid, allroles, roleid, resist }) => {
          if (beastid) {
            promiseArray.push(db.update.spell(spellid, name, origin, shape, range, interval, effect, beastid, allroles, roleid, resist).catch(e => sendErrorForward('add beast update spell', e, res)))
          } else {
            promiseArray.push(db.add.spell(spellid, name, origin, shape, range, interval, effect, id, allroles, roleid, resist).catch(e => sendErrorForward('add beast add spell', e, res)))
          }
        })
      }

      if (deletedSpellList) {
        deletedSpellList.forEach(val => {
          promiseArray.push(db.delete.spell(val, id).catch(e => sendErrorForward('add beast delete spell list', e, res)))
        })
      }

      promiseArray.push(db.delete.obstacles([id, [0, ...obstacles.map(obstacles => obstacles.id)]]).then(_ => {
        return obstacles.map(({ id: uniqueid, obstacleid, notes }) => {
          if (!uniqueid) {
            return db.add.obstacles(id, obstacleid, notes).catch(e => sendErrorForward('add beast add obstacles', e, res))
          } else {
            return true
          }
        })
      }).catch(e => sendErrorForward('add beast delete obstacles', e, res)))

      promiseArray.push(db.delete.folklore([id, [0, ...folklore.map(folklore => folklore.id)]]).then(_ => {
        return folklore.map(({ id: uniqueid, belief, truth }) => {
          if (!uniqueid) {
            return db.add.folklore(id, belief, truth).catch(e => sendErrorForward('add beast add folklore', e, res))
          } else {
            return db.update.folklore(uniqueid, id, belief, truth).catch(e => sendErrorForward('add beast update folklore', e, res))
          }
        })
      }).catch(e => sendErrorForward('add beast delete folklore', e, res)))

      promiseArray.push(db.delete.challenges([id, [0, ...challenges.map(challenges => challenges.id)]]).then(_ => {
        return challenges.map(({ challengesid }) => {
          if (!uniqueid) {
            return db.add.challenges(challengesid, id).catch(e => sendErrorForward('add beast add challenges', e, res))
          } else {
            return true
          }
        })
      }).catch(e => sendErrorForward('add beast delete challenges', e, res)))

      Promise.all(promiseArray).then(_ => {
        controllerObj.collectCatelog(app)
        checkForContentTypeBeforeSending(res, { id })
      }).catch(e => sendErrorForward('add beast final array', e, res))
    }).catch(e => sendErrorForward('add beast main', e, res))
  },
  editBeast({ app, body }, res) {
    const db = app.get('db')
    let { id, name, hr, intro, habitat, ecology, climates, number_min, number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, subsystem, patreon, largeweapons, panic, mental, types, movement, conflict, skills, variants, loot, reagents, lootnotes, traitlimit, devotionlimit, flawlimit, passionlimit, encounter, plural, thumbnail, rarity, locationalvitality, lairloot, roles, casting, spells, deletedSpellList, challenges, obstacles, caution, role, combatpoints, socialrole, socialpoints, secondaryrole, skillrole, skillpoints, fatigue, artistInfo, defaultrole, socialsecondary, notrauma, carriedloot, folklore, combatStatArray, knockback: mainknockback, singledievitality, noknockback, tables, rolenameorder, descriptionshare, convictionshare, devotionshare } = body
    // update beast
    db.update.beast(name, hr, intro, habitat, ecology, +number_min, +number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, subsystem ? +subsystem : null, +patreon, largeweapons, panic, mental, lootnotes, +traitlimit > 0 ? +traitlimit : null, +devotionlimit > 0 ? +devotionlimit : null, +flawlimit > 0 ? +flawlimit : null, +passionlimit > 0 ? +passionlimit : null, plural, thumbnail, rarity, caution, role, combatpoints, socialrole, socialpoints, id, secondaryrole, skillrole, skillpoints, fatigue, defaultrole, socialsecondary, notrauma, mainknockback, singledievitality, noknockback, rolenameorder, descriptionshare, convictionshare, devotionshare).then(result => {
      let promiseArray = []

      promiseArray.push(db.delete.roles([id, ['', ...roles.map(roles => roles.id)]]).then(_ => {
        return roles.map(({ id: roleid, vitality, hash, name, role, attack, defense, secondaryrole, combatpoints, stress, panic, caution, socialrole, socialpoints, skillrole, skillpoints, socialsecondary, size, fatigue, largeweapons, mental, knockback, singledievitality, noknockback }) => {
          if (!hash) {
            hash = controllerObj.createHash()
          }
          return db.add.beastroles(roleid, id, vitality, hash, name, role, attack, defense, secondaryrole, combatpoints, stress, panic, caution, socialrole, socialpoints, skillrole, skillpoints, socialsecondary, size, fatigue, largeweapons, mental, knockback, singledievitality, noknockback).catch(e => sendErrorForward('update beast add roles', e, res))
        })
      }).catch(e => sendErrorForward('update beast delete roles', e, res)))
      // update types
      types.forEach(val => {
        if (!val.id) {
          promiseArray.push(db.add.beasttype(id, val.typeid).catch(e => sendErrorForward('update beast add types', e, res)))
        } else if (val.deleted) {
          promiseArray.push(db.delete.beasttype(val.id).catch(e => sendErrorForward('update beast delete types', e, res)))
        }
      })

      // update climate
      climates.beast.forEach(val => {
        if (val.deleted) {
          promiseArray.push(db.delete.climate.climate(val.uniqueid).catch(e => sendErrorForward('update beast delete climate', e, res)))
        } else if (!val.uniqueid) {
          promiseArray.push(db.add.climate(id, val.climateid).catch(e => sendErrorForward('update beast add climate', e, res)))
        }
      })

      // update combat
      promiseArray.push(db.delete.combatStats([id, [0, ...combatStatArray.map(combatStat => combatStat.id)]]).then(_ => {
        return combatStatArray.map(({ id: uniqueid, roleid, piercingweapons, slashingweapons, crushingweapons, weaponsmallslashing,
          weaponsmallcrushing, weaponsmallpiercing, andslashing, andcrushing, flanks, rangeddefence, alldefense, allaround, armorandshields,
          unarmored, attack, isspecial, eua, addsizemod, weapon, shield, armor, weaponname, rangeddefense, initiative, measure, recovery, showonlydefenses, weapontype, rangedistance, swarmbonus, adjustment, tdr }) => {
          if (!uniqueid) {
            return db.add.combatStats(id, roleid, piercingweapons, slashingweapons, crushingweapons, weaponsmallslashing,
              weaponsmallcrushing, weaponsmallpiercing, andslashing, andcrushing, flanks, rangeddefence, alldefense, allaround, armorandshields,
              unarmored, attack, isspecial, eua, addsizemod, weapon, shield, armor, weaponname, rangeddefense, initiative, measure, recovery, showonlydefenses, weapontype, rangedistance, swarmbonus, adjustment, tdr ).catch(e => sendErrorForward('update beast add combat', e, res))
          } else {
            return db.update.combatStats(uniqueid, id, roleid, piercingweapons, slashingweapons, crushingweapons, weaponsmallslashing,
              weaponsmallcrushing, weaponsmallpiercing, andslashing, andcrushing, flanks, rangeddefence, alldefense, allaround, armorandshields,
              unarmored, attack, isspecial, eua, addsizemod, weapon, shield, armor, weaponname, rangeddefense, initiative, measure, recovery, showonlydefenses, weapontype, rangedistance, swarmbonus, adjustment, tdr ).catch(e => sendErrorForward('update beast update combat', e, res))
          }
        })
      }).catch(e => sendErrorForward('update beast delete combat', e, res)))
      // update conflict
      let newConflict = []
      Object.keys(conflict).forEach(key => newConflict = [...newConflict, ...conflict[key]])
      newConflict.forEach(({ trait, value, type, id: conflictId, deleted, socialroleid, allroles, severity, strength, adjustment }) => {
        if (deleted) {
          promiseArray.push(db.delete.beastconflict(conflictId).catch(e => sendErrorForward('update beast delete confrontation', e, res)))
        } else if (!conflictId) {
          promiseArray.push(db.add.beastconflict(id, trait, value, type, socialroleid, allroles, severity, strength, adjustment).catch(e => sendErrorForward('update beast add confrontation', e, res)))
        } else {
          promiseArray.push(db.update.beastconflict(id, trait, value, type, conflictId, socialroleid, allroles, severity, strength, adjustment).catch(e => sendErrorForward('update beast update roles', e, res)))
        }
      })
      // update skills
      skills.forEach(({ skill, rank, id: skillId, deleted, skillroleid, allroles, strength, adjustment }) => {
        if (deleted) {
          promiseArray.push(db.delete.beastskill(skillId).catch(e => sendErrorForward('update beast delete skills', e, res)))
        } else if (!skillId) {
          promiseArray.push(db.add.beastskill(id, skill, rank, skillroleid, allroles, strength, adjustment).catch(e => sendErrorForward('update beast add skills', e, res)))
        } else {
          promiseArray.push(db.update.beastskill(id, skill, rank, skillId, skillroleid, allroles, strength, adjustment).catch(e => sendErrorForward('update beast update skills', e, res)))
        }
      })
      // update movement
      movement.forEach(({ stroll, walk, jog, run, sprint, type, id: movementId, deleted, roleid, allroles, strollstrength, walkstrength, jogstrength, runstrength, sprintstrength, adjustment }) => {
        if (deleted) {
          promiseArray.push(db.delete.beastmovement(movementId).catch(e => sendErrorForward('update beast delete movement', e, res)))
        } else if (!movementId) {
          promiseArray.push(db.add.beastmovement(id, stroll, walk, jog, run, sprint, type, roleid, allroles, strollstrength, walkstrength, jogstrength, runstrength, sprintstrength, adjustment).catch(e => sendErrorForward('update beast add movement', e, res)))
        } else {
          promiseArray.push(db.update.beastmovement(id, stroll, walk, jog, run, sprint, type, movementId, roleid, allroles, strollstrength, walkstrength, jogstrength, runstrength, sprintstrength, adjustment).catch(e => sendErrorForward('update beast update movement', e, res)))
        }
      })
      // update variants
      variants.forEach(({ id: checkId, variantid, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.beastvariants(id, variantid).catch(e => sendErrorForward('update beast delete variants 1', e, res)))
          promiseArray.push(db.delete.beastvariants(variantid, id).catch(e => sendErrorForward('update beast delete variants 2', e, res)))
        } else if (!checkId) {
          promiseArray.push(db.add.beastvariants(id, variantid).catch(e => sendErrorForward('update beast add variants 1', e, res)))
          promiseArray.push(db.add.beastvariants(variantid, id).catch(e => sendErrorForward('update beast add variants 2', e, res)))
        }
      })
      // update loot
      loot.forEach(({ loot, price, id: lootId, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.beastloot(lootId).catch(e => sendErrorForward('update beast delete beast loot', e, res)))
        } else if (!lootId) {
          promiseArray.push(db.add.beastloot(id, loot, price).catch(e => sendErrorForward('update beast add beast loot', e, res)))
        } else {
          promiseArray.push(db.update.beastloot(id, loot, price, lootId).catch(e => sendErrorForward('update beast update beast loot', e, res)))
        }
      })
      // update reagents
      reagents.forEach(({ name, spell, difficulty, harvest, id: reagentId, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.beastreagents(reagentId).catch(e => sendErrorForward('update beast delete pleroma', e, res)))
        } else if (!reagentId) {
          promiseArray.push(db.add.beastreagents(id, name, spell, difficulty, harvest).catch(e => sendErrorForward('update beast add pleroma', e, res)))
        } else {
          promiseArray.push(db.update.beastreagents(id, name, spell, difficulty, harvest, reagentId).catch(e => sendErrorForward('update beast update pleroma', e, res)))
        }
      })

      if (locationalvitality.length > 0) {
        locationalvitality.forEach(({ id: locationid, location, vitality, beastid, deleted, roleid, allroles }) => {
          if (deleted) {
            promiseArray.push(db.delete.locationalvitality(locationid).catch(e => sendErrorForward('update beast delete locational vitality', e, res)))
          } else if (locationid && beastid) {
            promiseArray.push(db.update.locationalvitality(beastid, location, vitality, locationid, roleid, allroles).catch(e => sendErrorForward('update beast update locational vitality', e, res)))
          } else {
            promiseArray.push(db.add.locationalvitality(id, location, vitality, allroles, roleid).catch(e => sendErrorForward('update beast add locational vitality', e, res)))
          }
        })
      }

      let { id: dbid, artistid, artist, tooltip, link } = artistInfo;
      if (artist) {
        if (!artistid) {
          promiseArray.push(db.add.allartists(artist, tooltip, link).then(result => {
            return promiseArray.push(db.add.artist(id, result[0].id).then(result => result).catch(e => sendErrorForward('update beast add artist 1', e, res)))
          }).catch(e => sendErrorForward('update beast add all artists', e, res)))
        } else {
          promiseArray.push(db.add.artist(id, artistid).then(result => result).catch(e => sendErrorForward('update beast add artist 2', e, res)))
        }
      }

      let {appearance, habitat, attack, defense} = tables
      promiseArray.push(db.delete.table(id, [0, ...appearance.map(table => table.id), ...habitat.map(table => table.id), ...attack.map(table => table.id), ...defense.map(table => table.id)]))
      appearance.forEach(table => {
        if (table.id) {
          promiseArray.push(db.update.alltables(table.id, table.label).catch(e => sendErrorForward('update beast appearance all tables', e, res)))
          db.delete.rows([table.id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
            table.rows.forEach(({weight, value, id: rowid}) => {
                promiseArray.push(db.add.row(rowid, table.id, weight, value).catch(e => sendErrorForward('update beast appearance add rows', e, res)))
            })
          }).catch(e => sendErrorForward('update beast appearance delete row', e, res))
        } else {
          promiseArray.push(db.add.alltables(table.label, 'ap').then(result => {
            promiseArray.push(db.add.table(id, result[0].id).catch(e => sendErrorForward('update beast appearance add table2 ', e, res)))
            db.delete.rows([result[0].id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
              table.rows.forEach(({weight, value, id: rowid}) => {
                promiseArray.push(db.add.row(rowid, result[0].id, weight, value).catch(e => sendErrorForward('update beast appearance add rows 2', e, res)))
              })
            }).catch(e => sendErrorForward('update beast appearance delete rows 2', e, res))
          }).catch(e => sendErrorForward('update beast appearance all tables 2', e, res)))
        }
      })
      habitat.forEach(table => {
        if (table.id) {
          promiseArray.push(db.update.alltables(table.id, table.label).catch(e => sendErrorForward('update beast habitat all tables', e, res)))
          db.delete.rows([table.id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
            table.rows.forEach(({weight, value, id: rowid}) => {
                promiseArray.push(db.add.row(rowid, table.id, weight, value).catch(e => sendErrorForward('update beast habitat add rows', e, res)))
            })
          }).catch(e => sendErrorForward('update beast habitat delete rows', e, res))
        } else {
          promiseArray.push(db.add.alltables(table.label, 'ha').then(result => {
            promiseArray.push(db.add.table(id, result[0].id))
            db.delete.rows([result[0].id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
              table.rows.forEach(({weight, value, id: rowid}) => {
                promiseArray.push(db.add.row(rowid, result[0].id, weight, value).catch(e => sendErrorForward('update beast habitat add rows 2', e, res)))
              })
            }).catch(e => sendErrorForward('update beast habitat delete rows 2', e, res))
          }).catch(e => sendErrorForward('update beast habitat all tables 2', e, res)))
        }
      })
      attack.forEach(table => {
        if (table.id) {
          promiseArray.push(db.update.alltables(table.id, table.label).catch(e => sendErrorForward('update beast attack all tables', e, res)))
          db.delete.rows([table.id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
            table.rows.forEach(({weight, value, id: rowid}) => {
                promiseArray.push(db.add.row(rowid, table.id, weight, value).catch(e => sendErrorForward('update beast attack add rows', e, res)))
            })
          }).catch(e => sendErrorForward('update beast attack delete rows', e, res))
        } else {
          promiseArray.push(db.add.alltables(table.label, 'at').then(result => {
            promiseArray.push(db.add.table(id, result[0].id))
            db.delete.rows([result[0].id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
              table.rows.forEach(({weight, value, id: rowid}) => {
                promiseArray.push(db.add.row(rowid, result[0].id, weight, value).catch(e => sendErrorForward('update beast attack add rows 2', e, res)))
              })
            }).catch(e => sendErrorForward('update beast attack delete rows 2', e, res))
          }).catch(e => sendErrorForward('update beast attack all tables 2', e, res)))
        }
      })
      defense.forEach(table => {
        if (table.id) {
          promiseArray.push(db.update.alltables(table.id, table.label).catch(e => sendErrorForward('update beast defense all tables', e, res)))
          db.delete.rows([table.id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
            table.rows.forEach(({weight, value, id: rowid}) => {
                promiseArray.push(db.add.row(rowid, table.id, weight, value).catch(e => sendErrorForward('update beast defense add rows', e, res)))
            })
          }).catch(e => sendErrorForward('update beast defense delete rows', e, res))
        } else {
          promiseArray.push(db.add.alltables(table.label, 'de').then(result => {
            promiseArray.push(db.add.table(id, result[0].id).catch(e => sendErrorForward('update beast defense all tables 2', e, res)))
            db.delete.rows([result[0].id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
              table.rows.forEach(({weight, value, id: rowid}) => {
                promiseArray.push(db.add.row(rowid, result[0].id, weight, value).catch(e => sendErrorForward('update beast defense add rows', e, res)))
              })
            }).catch(e => sendErrorForward('update beast defense delete rows ', e, res))
          }).catch(e => sendErrorForward('update beast defense all tables 2', e, res)))
        }
      })

      let { temperament, signs, rank, noun, verb, groups, numbers } = encounter;
      temperament.temperament.forEach(({ temperament: temp, weight, id: tempid, beastid, tooltip, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.temperament(beastid, tempid).catch(e => sendErrorForward('update beast delete temp', e, res)))
        } else if ((tempid && !beastid) || (tempid && beastid !== id)) {
          promiseArray.push(db.add.encounter.temperament(id, tempid, weight).catch(e => sendErrorForward('update beast add temp', e, res)))
        } else if (tempid && beastid) {
          promiseArray.push(db.update.encounter.temperament(weight, beastid, tempid).catch(e => sendErrorForward('update beast update temp', e, res)))
        } else if (!tempid) {
          db.add.encounter.allTemp(temp, tooltip).then(result => {
            promiseArray.push(db.add.encounter.temperament(id, result[0].id, weight).catch(e => sendErrorForward('update beast add temp 2', e, res)))
          }).catch(e => sendErrorForward('update beast add all temp', e, res))
        }
      })

      groups.forEach(({ id: groupid, beastid, deleted, label, weights, weight }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.groups(id, groupid).then(_ => db.delete.encounter.groupRoles(beastid, groupid).catch(e => sendErrorForward('update beast delete group roles', e, res))).catch(e => sendErrorForward('update beast delete groups', e, res)))
        } else if (groupid && beastid) {
          promiseArray.push(db.update.encounter.groups(beastid, groupid, label, +weight).then(_ => {
            let groupPromises = []
            weights.forEach(({ id: roleid, weight: roleweight, role, deleted }) => {
              if (deleted && roleid) {
                groupPromises.push(db.delete.encounter.groupRoles(id, roleid).catch(e => sendErrorForward('update beast delete groups role', e, res)))
              } else if (roleid) {
                groupPromises.push(db.update.encounter.groupRoles(id, roleid, groupid, +roleweight, role).catch(e => sendErrorForward('update beast update groups role', e, res)))
              } else {
                groupPromises.push(db.add.encounter.groupRoles(id, groupid, +roleweight, role).catch(e => sendErrorForward('update beast add groups role', e, res)))
              }
            })
            return Promise.all(groupPromises)
          }).catch(e => sendErrorForward('update beast update groups', e, res)))
        } else if (!groupid) {
          promiseArray.push(db.add.encounter.groups(id, label, +weight).then(result => {
            let groupPromises = []
            groupid = result[0].id
            weights.forEach(({ id: roleid, weight: roleweight, role }) => {
              if (roleid) {
                groupPromises.push(db.update.encounter.groupRoles(id, roleid, groupid, +roleweight, role).catch(e => sendErrorForward('update beast update groups role 2', e, res)))
              } else {
                groupPromises.push(db.add.encounter.groupRoles(id, groupid, +roleweight, role).catch(e => sendErrorForward('update beast add groups role 2', e, res)))
              }
            })
            return Promise.all(groupPromises)
          }).catch(e => sendErrorForward('update beast add groups 2', e, res)))
        }
      })

      numbers.forEach(({ id: numberid, beastid, deleted, numbers, miles, weight }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.numbers(id, numberid).catch(e => sendErrorForward('update beast delete numbers', e, res)))
        } else if (numberid) {
          promiseArray.push(db.update.encounter.numbers(id, numberid, numbers, miles, +weight).catch(e => sendErrorForward('update beast update numbers', e, res)))
        } else if (!numberid) {
          promiseArray.push(db.add.encounter.numbers(id, numbers, miles, +weight).catch(e => sendErrorForward('update beast add numbers', e, res)))
        }
      })

      signs.signs.forEach(({ sign, weight, id: signid, beastid, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.sign(beastid, signid).catch(e => sendErrorForward('update beast delete sign', e, res)))
        } else if ((signid && !beastid) || (signid && beastid !== id)) {
          promiseArray.push(db.add.encounter.sign(id, signid, weight).catch(e => sendErrorForward('update beast add sign', e, res)))
        } else if (signid && beastid) {
          promiseArray.push(db.update.encounter.signs(weight, beastid, signid).catch(e => sendErrorForward('update beast update sign', e, res)))
        } else if (!signid) {
          db.add.encounter.allSigns(sign).then(result => {
            promiseArray.push(db.add.encounter.sign(id, result[0].id, weight).catch(e => sendErrorForward('update beast add sign w/ weight', e, res)))
          }).catch(e => sendErrorForward('update beast all signs', e, res))
        }
      })

      verb.verb.forEach(({ verb, id: verbid, beastid, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.verb(beastid, verbid).catch(e => sendErrorForward('update beast delete verb', e, res)))
        } else if ((verbid && !beastid) || (verbid && beastid !== id)) {
          promiseArray.push(db.add.encounter.verb(verbid, id).catch(e => sendErrorForward('update beast add add', e, res)))
        } else if (!verbid) {
          db.add.encounter.allVerb(verb).then(result => {
            promiseArray.push(db.add.encounter.verb(result[0].id, id).catch(e => sendErrorForward('update beast add verb 2', e, res)))
          }).catch(e => sendErrorForward('update beast add all verbs', e, res))
        }
      })

      noun.noun.forEach(({ noun, id: nounid, beastid, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.noun(beastid, nounid).catch(e => sendErrorForward('update beast delete noun', e, res)))
        } else if ((nounid && !beastid) || (nounid && beastid !== id)) {
          promiseArray.push(db.add.encounter.noun(nounid, id).catch(e => sendErrorForward('update beast add noun', e, res)))
        } else if (!nounid) {
          db.add.encounter.allNoun(noun).then(result => {
            promiseArray.push(db.add.encounter.noun(result[0].id, id).catch(e => sendErrorForward('update beast add noun 2', e, res)))
          }).catch(e => sendErrorForward('update beast all nouns', e, res))
        }
      })

      let { beastid, copper, silver, gold, potion, relic, enchanted, equipment, traited, scrolls, alms, talisman } = lairloot
      if (!beastid) {
        promiseArray.push(db.add.loot.lairbasic(id, copper, silver, gold, potion, relic, enchanted, talisman).catch(e => sendErrorForward('update beast add basic lair', e, res)))
      } else {
        promiseArray.push(db.update.loot.lairbasic(beastid, copper, silver, gold, potion, relic, enchanted, talisman).catch(e => sendErrorForward('update beast update basic lair', e, res)))
      }

      equipment.forEach(({ id: equipid, beastid, value, number, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.loot.lairequipment(beastid, equipid).catch(e => sendErrorForward('update beast delete lair equipment', e, res)))
        } else if (equipid && beastid) {
          promiseArray.push(db.update.loot.lairequipment(equipid, value, number).catch(e => sendErrorForward('update beast update lair equipment', e, res)))
        } else {
          promiseArray.push(db.add.loot.lairequipment(id, value, number).catch(e => sendErrorForward('update beast add lair equipment', e, res)))
        }
      })

      traited.forEach(({ id: traitedid, beastid, value, chancetable, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.loot.lairtraited(beastid, traitedid).catch(e => sendErrorForward('update beast delete lair traited equipment', e, res)))
        } else if (traitedid && beastid) {
          promiseArray.push(db.update.loot.lairtraited(traitedid, value, chancetable).catch(e => sendErrorForward('update beast update lair equipment', e, res)))
        } else {
          promiseArray.push(db.add.loot.lairtraited(id, value, chancetable).catch(e => sendErrorForward('update beast add lair equipment', e, res)))
        }
      })

      scrolls.forEach(({ id: scrollid, beastid, number, power, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.loot.lairscrolls(beastid, scrollid).catch(e => sendErrorForward('update beast delete lair scrolls', e, res)))
        } else if (scrollid && beastid) {
          promiseArray.push(db.update.loot.lairscrolls(scrollid, number, power).catch(e => sendErrorForward('update beast update lair scrolls', e, res)))
        } else {
          promiseArray.push(db.add.loot.lairscrolls(id, number, power).catch(e => sendErrorForward('update beast add lair scrolls', e, res)))
        }
      })

      alms.forEach(({ id: almid, beastid, number, favor, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.loot.lairalms(beastid, almid).catch(e => sendErrorForward('update beast delete lair alms', e, res)))
        } else if (almid && beastid) {
          promiseArray.push(db.update.loot.lairalms(almid, number, favor).catch(e => sendErrorForward('update beast update lair alms', e, res)))
        } else {
          promiseArray.push(db.add.loot.lairalms(id, number, favor).catch(e => sendErrorForward('update beast add lair alms', e, res)))
        }
      })


      let { beastid: cbeastid, copper: ccopper, silver: csilver, gold: cgold, potion: cpotion, relic: crelic, enchanted: cenchanted, equipment: cequipment, traited: ctraited, scrolls: cscrolls, alms: calms, talisman: ctalisman } = carriedloot
      if (!cbeastid) {
        promiseArray.push(db.add.loot.carriedbasic(id, ccopper, csilver, cgold, cpotion, crelic, cenchanted, ctalisman).catch(e => sendErrorForward('update beast add carried basic', e, res)))
      } else {
        promiseArray.push(db.update.loot.carriedbasic(cbeastid, ccopper, csilver, cgold, cpotion, crelic, cenchanted, ctalisman).catch(e => sendErrorForward('update beast update carried basic', e, res)))
      }

      cequipment.forEach(({ id: equipid, beastid, value, number, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.loot.carriedequipment(cbeastid, equipid).catch(e => sendErrorForward('update beast delete carried equipment', e, res)))
        } else if (equipid && cbeastid) {
          promiseArray.push(db.update.loot.carriedequipment(equipid, value, number).catch(e => sendErrorForward('update beast update carried equipment', e, res)))
        } else {
          promiseArray.push(db.add.loot.carriedequipment(id, value, number).catch(e => sendErrorForward('update beast add carried equipment', e, res)))
        }
      })

      ctraited.forEach(({ id: traitedid, beastid, value, chancetable, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.loot.carriedtraited(cbeastid, traitedid).catch(e => sendErrorForward('update beast delete carried equipment', e, res)))
        } else if (traitedid && cbeastid) {
          promiseArray.push(db.update.loot.carriedtraited(traitedid, value, chancetable).catch(e => sendErrorForward('update beast update carried equipment', e, res)))
        } else {
          promiseArray.push(db.add.loot.carriedtraited(id, value, chancetable).catch(e => sendErrorForward('update beast add carried equipment', e, res)))
        }
      })

      cscrolls.forEach(({ id: scrollid, beastid, number, power, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.loot.carriedscrolls(cbeastid, scrollid).catch(e => sendErrorForward('update beast delete carried scrolls', e, res)))
        } else if (scrollid && cbeastid) {
          promiseArray.push(db.update.loot.carriedscrolls(scrollid, number, power).catch(e => sendErrorForward('update beast update carried scrolls', e, res)))
        } else {
          promiseArray.push(db.add.loot.carriedscrolls(id, number, power).catch(e => sendErrorForward('update beast add carried scrolls', e, res)))
        }
      })

      calms.forEach(({ id: almid, beastid, number, favor, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.loot.carriedalms(cbeastid, almid).catch(e => sendErrorForward('update beast delete carried alms', e, res)))
        } else if (almid && cbeastid) {
          promiseArray.push(db.update.loot.carriedalms(almid, number, favor).catch(e => sendErrorForward('update beast update carried alms', e, res)))
        } else {
          promiseArray.push(db.add.loot.carriedalms(id, number, favor).catch(e => sendErrorForward('update beast add carried alms', e, res)))
        }
      })

      if (casting.beastid) {
        let { augur, wild, vancian, spellnumberdie, manifesting, commanding, bloodpact, defaulttype } = casting
        promiseArray.push(db.update.casting(augur, wild, vancian, spellnumberdie, manifesting, commanding, bloodpact, defaulttype, id).catch(e => sendErrorForward('update beast update casting', e, res)))
      } else {
        promiseArray.push(db.update.casting(null, null, null, 'd4', null, null, null, null, id).catch(e => sendErrorForward('update beast update casting 2', e, res)))
      }
      spells.forEach(({ id: spellid, name, origin, shape, range, interval, effect, beastid, allroles, roleid, resist }) => {
        if (beastid) {
          promiseArray.push(db.update.spell(spellid, name, origin, shape, range, interval, effect, beastid, allroles, roleid, resist).catch(e => sendErrorForward('update beast update spell', e, res)))
        } else {
          promiseArray.push(db.add.spell(spellid, name, origin, shape, range, interval, effect, id, allroles, roleid, resist).catch(e => sendErrorForward('update beast add spell', e, res)))
        }
      })
      if (deletedSpellList) {
        deletedSpellList.forEach(val => {
          promiseArray.push(db.delete.spell(val, beastid).catch(e => sendErrorForward('update beast delete spell', e, res)))
        })
      }

      promiseArray.push(db.delete.obstacles([id, [0, ...obstacles.map(obstacles => obstacles.id)]]).then(_ => {
        return obstacles.map(({ id: uniqueid, obstacleid, notes }) => {
          if (!uniqueid) {
            return db.add.obstacles(id, obstacleid, notes).catch(e => sendErrorForward('update beast add obstacles', e, res))
          } else {
            return true
          }
        })
      }).catch(e => sendErrorForward('update beast delete obstacles', e, res)))

      promiseArray.push(db.delete.folklore([id, [0, ...folklore.map(folklore => folklore.id)]]).then(_ => {
        return folklore.map(({ id: uniqueid, belief, truth }) => {
          if (!uniqueid) {
            return db.add.folklore(id, belief, truth).catch(e => sendErrorForward('update beast add folklore', e, res))
          } else {
            return db.update.folklore(uniqueid, id, belief, truth).catch(e => sendErrorForward('update beast update folklore', e, res))
          }
        })
      }).catch(e => sendErrorForward('update beast delete folkore', e, res)))

      promiseArray.push(db.delete.challenges([id, [0, ...challenges.map(challenges => challenges.id)]]).then(_ => {
        return challenges.map(({ id: uniqueid, challengeid }) => {
          if (!uniqueid) {
            return db.add.challenges(id, challengeid).catch(e => sendErrorForward('update beast add challenges', e, res))
          } else {
            return true
          }
        })
      }).catch(e => sendErrorForward('update beast delete challenges', e, res)))

      Promise.all(promiseArray).then(_ => {
        controllerObj.collectCatelog(app)
        checkForContentTypeBeforeSending(res, {id})
      }).catch(e => sendErrorForward('update beast final promise', e, res))
    }).catch(e => sendErrorForward('update beast main', e, res))
  },
  deleteBeast(req, res) {
    const db = req.app.get('db')
    let id = +req.params.id

    db.delete.beast(id).then(_ => {
      let promiseArray = []

      promiseArray.push(db.delete.allbeasttypes(id).catch(e => sendErrorForward('delete beast types', e, res)))
      promiseArray.push(db.delete.allclimates(id).catch(e => sendErrorForward('delete beast climates', e, res)))
      promiseArray.push(db.delete.allbeastcombat(id).catch(e => sendErrorForward('delete beast combat', e, res)))
      promiseArray.push(db.delete.allbeastconflict(id).catch(e => sendErrorForward('delete beast confrontation', e, res)))
      promiseArray.push(db.delete.allbeastskill(id).catch(e => sendErrorForward('delete beast skill', e, res)))
      promiseArray.push(db.delete.allbeastloot(id).catch(e => sendErrorForward('delete beast loot', e, res)))
      promiseArray.push(db.delete.allbeastmovement(id).catch(e => sendErrorForward('delete beast movement', e, res)))
      promiseArray.push(db.delete.allbeastreagents(id).catch(e => sendErrorForward('delete beast reagents', e, res)))
      promiseArray.push(db.delete.encounter.allNoun(id).catch(e => sendErrorForward('delete beast noun', e, res)))
      promiseArray.push(db.delete.encounter.allTemperament(id).catch(e => sendErrorForward('delete beast temp', e, res)))
      promiseArray.push(db.delete.encounter.allVerb(id).catch(e => sendErrorForward('delete beast verb', e, res)))
      promiseArray.push(db.delete.encounter.allNumbers(id).catch(e => sendErrorForward('delete beast numbers', e, res)))
      promiseArray.push(db.delete.encounter.allGroups(id).catch(e => sendErrorForward('delete beast groups', e, res)))
      promiseArray.push(db.delete.encounter.allGroupRoles(id).catch(e => sendErrorForward('delete beast group roles', e, res)))
      promiseArray.push(db.delete.alllocationalvitality(id).catch(e => sendErrorForward('delete beast locational vitality', e, res)))
      promiseArray.push(db.delete.loot.lairbasic(id).catch(e => sendErrorForward('delete beast basic', e, res)))
      promiseArray.push(db.delete.loot.lairallequipment(id).catch(e => sendErrorForward('delete beast equipment', e, res)))
      promiseArray.push(db.delete.loot.lairalltraited(id).catch(e => sendErrorForward('delete beast traits', e, res)))
      promiseArray.push(db.delete.loot.lairallscrolls(id).catch(e => sendErrorForward('delete beast scrolls', e, res)))
      promiseArray.push(db.delete.loot.lairallalms(id).catch(e => sendErrorForward('delete beast alms', e, res)))
      promiseArray.push(db.delete.loot.carriedbasic(id).catch(e => sendErrorForward('delete beast carried basic', e, res)))
      promiseArray.push(db.delete.loot.carriedallequipment(id).catch(e => sendErrorForward('delete beast carred equipment', e, res)))
      promiseArray.push(db.delete.loot.carriedalltraited(id).catch(e => sendErrorForward('delete beast carried traited', e, res)))
      promiseArray.push(db.delete.loot.carriedallscrolls(id).catch(e => sendErrorForward('delete beast carried scrolls', e, res)))
      promiseArray.push(db.delete.loot.carriedallalms(id).catch(e => sendErrorForward('delete beast carried alms', e, res)))
      promiseArray.push(db.delete.allfolklore(id).catch(e => sendErrorForward('delete beast folklore', e, res)))
      // promiseArray.push(db.delete.beastvariants(id, variantid).then())
      // promiseArray.push(db.delete.combatranges(id, variantid).then())

      Promise.all(promiseArray).then(_ => {
        controllerObj.collectCatelog(req.app)
        checkForContentTypeBeforeSending(res, { id })
      }).catch(e => sendErrorForward('delete beast final promise', e, res))
    })
  },
  addFavorite(req, res) {
    const db = req.app.get('db')
      , { beastid } = req.body
    if (req.user && req.user.id) {
      db.get.favoriteCount(req.user.id).then(result => {
        if (+result[0].count <= ((req.user.patreon * 3) + 3)) {
          db.add.favorite(req.user.id, beastid).then(_ => checkForContentTypeBeforeSending(res, { color: "green", message: `Monster Favorited` }).catch(e => sendErrorForward('add favorite', e, res)))
        } else {
          checkForContentTypeBeforeSending(res, { color: "yellow", message: "You have too many favorited monsters: delete some or upgrade your Patreon tier" })
        }
      }).catch(e => sendErrorForward('get favorite count', e, res))
    } else {
      checkForContentTypeBeforeSending(res, { color: "red", message: "You Need to Log On to Favorite Monsters" })
    }
  },
  deleteFavorite(req, res) {
    const db = req.app.get('db')
      , { beastid } = req.params
    if (req.user && req.user.id) {
      db.delete.favorite(req.user.id, beastid).then(_ => checkForContentTypeBeforeSending(res, { color: "green", message: 'Monster Unfavorited' }).catch(e => sendErrorForward('delete favorite', e, res)))
    } else {
      checkForContentTypeBeforeSending(res, { color: "red", message: "You Need to Log On to Unfavorite Monsters" })
    }
  },
  getUsersFavorites(req, res) {
    const db = req.app.get('db')
    if (req.user && req.user.id) {
      db.get.favorites(req.user.id).then(result => {
        let finalArray = []

        result = result.map(beast => {
          finalArray.push(db.get.rolesforcatalog(beast.id).then(result => {
            beast.roles = result
            if (!beast.defaultrole && beast.roles.length > 0) {
              beast.defaultrole = beast.roles[0].id
            }
            if (beast.defaultrole) {
              for (let i = 0; i < beast.roles.length; i++) {
                if (beast.roles[i].id === beast.defaultrole) {
                  beast.role = beast.roles[i].role
                  beast.secondaryrole = beast.roles[i].secondaryrole
                  beast.socialrole = beast.roles[i].socialrole
                  beast.skillrole = beast.roles[i].skillrole
                  i = beast.roles.length
                }
              }
            }
            return beast
          }).catch(e => sendErrorForward('get favorite roles', e, res)))
          return beast
        })

        Promise.all(finalArray).then(_ => {
          checkForContentTypeBeforeSending(res, result)
        }).catch(e => sendErrorForward('get favorite final promise', e, res))
      }).catch(e => sendErrorForward('get favorites', e, res))
    } else {
      checkForContentTypeBeforeSending(res, { message: "You Need to Log On to Favorite Monsters" })
    }
  },
  getEditEncounter(req, res) {
    const db = req.app.get('db')
    let promiseArray = []
      , encounterObject = {
        temperament: {},
        rank: {},
        verb: {},
        noun: {},
        signs: {}
      }
      , beastid = +req.params.beastid

    promiseArray.push(db.get.encounter.temperament(beastid).then(result => {
      encounterObject.temperament.temperament = result
      return result
    }).catch(e => sendErrorForward('get encounter temp', e, res)))
    promiseArray.push(db.get.encounter.allTemp(beastid).then(result => {
      encounterObject.temperament.allTemp = result
      return result
    }).catch(e => sendErrorForward('get encounter all temp', e, res)))

    promiseArray.push(db.get.encounter.numbers(beastid).then(result => {
      encounterObject.numbers = result
      return result
    }).catch(e => sendErrorForward('get encounter numbers', e, res)))

    promiseArray.push(db.get.encounter.allGroups(beastid).then(result => {
      if (result.length === 0) {
        encounterObject.groups = result
        return result
      }

      let groupArray = []
      encounterObject.groups = []

      result.forEach(group => {
        groupArray.push(db.get.encounter.groupRoles(group.id).then(roles => {
          group.weights = roles
          encounterObject.groups.push(group)
          return true
        }).catch(e => sendErrorForward('get encounter group roles', e, res)))
      })

      return Promise.all(groupArray).then(finalArray => {
        return true
      }).catch(e => sendErrorForward('get encounter group final promise', e, res))
    }).catch(e => sendErrorForward('get encounter all groups', e, res)))

    promiseArray.push(db.get.encounter.verb(beastid).then(result => {
      encounterObject.verb.verb = result
      return result
    }).catch(e => sendErrorForward('get encounter verb', e, res)))
    promiseArray.push(db.get.encounter.allVerb(beastid).then(result => {
      encounterObject.verb.allVerb = result
      return result
    }).catch(e => sendErrorForward('get encounter all verbs', e, res)))

    promiseArray.push(db.get.encounter.noun(beastid).then(result => {
      encounterObject.noun.noun = result
      return result
    }).catch(e => sendErrorForward('get encounter noun', e, res)))
    promiseArray.push(db.get.encounter.allNoun(beastid).then(result => {
      encounterObject.noun.allNoun = result
      return result
    }).catch(e => sendErrorForward('get encounter all nouns', e, res)))

    promiseArray.push(db.get.encounter.signs(beastid).then(result => {
      encounterObject.signs.signs = result
      return result
    }).catch(e => sendErrorForward('get encounter signs', e, res)))
    promiseArray.push(db.get.encounter.allSigns(beastid).then(result => {
      encounterObject.signs.allSigns = result
      return result
    }).catch(e => sendErrorForward('get encounter all signs', e, res)))

    Promise.all(promiseArray).then(_ => {
      checkForContentTypeBeforeSending(res, encounterObject)
    }).catch(e => sendErrorForward('get encounter promise array', e, res))
  },
  getRandomEncounter(req, res) {
    const db = req.app.get('db')
    let promiseArray = []
      , encounterObject = {}
      , beastId = +req.params.beastid

    promiseArray.push(db.get.encounter.tempWeighted(beastId).then(result => {
      encounterObject.temperament = result[0]
      return result
    }).catch(e => sendErrorForward('get encounter temp weighted', e, res)))

    promiseArray.push(db.get.encounter.signWeighted(beastId).then(result => {
      encounterObject.sign = result[0]
      return result
    }).catch(e => sendErrorForward('get encounter sign weighted', e, res)))
    promiseArray.push(db.get.encounter.signsOrderedByWeight(beastId).then(result => {
      encounterObject.allSigns = result
      return result
    }).catch(e => sendErrorForward('get encounter signs order by weight', e, res)))

    promiseArray.push(db.get.encounter.verbWeighted(beastId).then(result => {
      if (result[0]) {
        encounterObject.verb = result[0].verb
      }
      return result
    }).catch(e => sendErrorForward('get encounter verb weighted', e, res)))

    promiseArray.push(db.get.encounter.nounWeighted(beastId).then(result => {
      if (result[0]) {
        encounterObject.noun = result[0].noun
      }
      return result
    }).catch(e => sendErrorForward('get encounter noun weighted', e, res)))

    promiseArray.push(db.get.encounter.battlefield().then(result => {
      if (result[0]) {
        encounterObject.battlefield = result[0].battlefield
      }
      return result
    }).catch(e => sendErrorForward('get encounter battlefield', e, res)))

    promiseArray.push(db.get.encounter.pattern().then(result => {
      if (result[0]) {
        encounterObject.pattern = result[0].pattern
      }
      return result
    }).catch(e => sendErrorForward('get encounter pattern', e, res)))

    promiseArray.push(db.get.encounter.allGroups(beastId).then(result => {
      if (result[0]) {
        encounterObject.allGroups = result
      }
      return result
    }).catch(e => sendErrorForward('get encounter all groups', e, res)))

    if (+req.query.groupId) {
      promiseArray.push(db.get.encounter.numbers(beastId).then(numbers => {
        if (numbers.length > 0) {
          return db.get.encounter.allGroups(beastId).then(groups => {
            if (groups.length > 0) {
              const groupId = +req.query.groupId
              return db.get.encounter.groupWeight(beastId, groupId).then(group => {
                const groupIndex = groups.findIndex(e => e.id === groupId)

                let number = numbers[groupIndex]
                if (!number) {
                  number = numbers[numbers.length - 1]
                }

                if (group.length > 0) {
                  encounterObject.main = getRandomEncounter(groups[groupIndex].label, [number], group)
                  return encounterObject.main
                }
                encounterObject.main = getRandomEncounter(groups[groupIndex].label, [number], [{ role: 'None', weight: 1 }])
                return encounterObject.main
              })
            } else {
              encounterObject.main = getRandomEncounter('Group', numbers, [{ role: 'None', weight: 1 }])
              return encounterObject.main
            }
          }).catch(e => sendErrorForward('get encounter all groups 2', e, res))
        }
        return true
      }).catch(e => sendErrorForward('get encounter random numbers', e, res)))
    } else {
      promiseArray.push(db.get.encounter.numbersWeight(beastId).then(numbers => {
        if (numbers.length > 0) {
          return db.get.encounter.groupsWeight(beastId).then(groups => {
            if (groups.length > 0) {
              const groupId = groups[0].id
              return db.get.encounter.groupWeight(beastId, groupId).then(group => {
                if (group.length > 0) {
                  encounterObject.main = getRandomEncounter(groups[0].label, numbers, group)
                  return encounterObject.main
                }
                encounterObject.main = getRandomEncounter(groups[0].label, numbers, [{ role: 'None', weight: 1 }])
                return encounterObject.main
              }).catch(e => sendErrorForward('get encounter groups weighted 3', e, res))
            } else {
              encounterObject.main = getRandomEncounter('Group', numbers, [{ role: 'None', weight: 1 }])
              return encounterObject.main
            }
          }).catch(e => sendErrorForward('get encounter groups weighted 2', e, res))
        }
        return true
      }).catch(e => sendErrorForward('get encounter numbers weighted 2', e, res)))
    }

    let randomEncounter = Math.floor(Math.random() * 10) > 5
    if (randomEncounter) {
      promiseArray.push(collectComplication(db, beastId).then(result => {
        let flatArray = []
        if (result && result.length) {
          result.forEach(element => {
            if (element.length) {
              element.forEach(val => flatArray.push(val))
            } else {
              flatArray.push(element)
            }
          })
        } else {
          flatArray.push(result)
        }
        encounterObject.complication = flatArray
        return result
      }).catch(e => sendErrorForward('get encounter complications', e, res)))
    }

    Promise.all(promiseArray).then(_ => {
      checkForContentTypeBeforeSending(res, encounterObject)
    }).catch(e => sendErrorForward('get random encounter finall array', e, res))
  }
}

async function collectComplication(db, beastId) {
  return db.get.complication.complication().then(result => {
    let complication = result[0]
    if (complication.id === 1 || complication.id === 14) {
      //rival
      console.log("RIVAL")
      console.log(beastId)
      return db.get.complication.rival(beastId).then(result => {
        if (result.length > 0) {
          let rival = result[0]
          if (rival.name && rival.name.includes(',')) {
            let splitname = rival.name.split(', ')
            rival.name = `${splitname[1]} ${splitname[0]}`
          }
          if (!rival.plural) {
            rival.plural = rival.name += 's'
          }

          if (complication.id === 1) {
            return {
              id: 1,
              type: 'Rival',
              rival: rival
            }
          } else {
            return {
              id: 14,
              type: 'Unlikely Allies',
              allies: rival
            }
          }

        } else {
          return null
        }
      }).catch(e => sendErrorForward('collect complication rival', e, null))
    } else if (complication.id === 2) {
      //wounded
      return db.get.complication.rival(beastId).then(result => {
        let woundCategories = ['Hurt', 'Bloodied', 'Wounded', 'Bleeding Out']
        return {
          id: 2,
          type: 'Wounded',
          byWhom: result[0],
          amount: woundCategories[Math.floor(Math.random() * 3)]
        }
      }).catch(e => sendErrorForward('collect complication rival 2', e, null))
    } else if (complication.id === 5) {
      //lost
      return { id: 5, type: 'Lost', distance: '10d10' }
    } else if (complication.id === 8) {
      //Back up coming
      return db.get.complication.backup(beastId).then(result => {
        let backup = result[0]
        if (backup) {
          if (backup.plural && backup.rank.toUpperCase() === 'NONE') {
            backup.rank = backup.name
            backup.rankplural = backup.plural
          } else if (!backup.plural && backup.rank.toUpperCase() === 'NONE') {
            backup.rank = backup.name
            backup.rankplural = backup.rank += 's'
          } else if (!backup.plural && backup.rank.toUpperCase() !== 'NONE') {
            backup.rankplural = backup.rank += 's'
          }

          return {
            id: 8,
            type: 'Back Up Coming',
            backup,
            time: '30d2'
          }
        } else {
          return {
            id: 8,
            type: 'Back Up Coming',
            backup: 'Double the Main Players',
            time: '30d2'
          }
        }

      }).catch(e => sendErrorForward('collect complication backup', e, null))
    } else if (complication.id === 12) {
      //roll an additional time
      let promiseArray = []
      promiseArray.push(collectComplication(db, beastId).then(result => {
        return result
      }).catch(e => sendErrorForward('collect complication 2', e, null)))
      promiseArray.push(collectComplication(db, beastId).then(result => {
        return result
      }).catch(e => sendErrorForward('collect complication rival 3', e, null)))
      return Promise.all(promiseArray).then(result => {
        let flatArray = []
        console.log(result)
        if (result[0].length) {
          result[0].forEach(val => flatArray.push(val))
        } else {
          flatArray.push(result)
        }
        if (result[1].length) {
          result[1].forEach(val => flatArray.push(val))
        } else {
          flatArray.push(result)
        }

        let dedupedArray = []
          , alreadyAddedCompIds = []

        flatArray.forEach(compl => {
          if (alreadyAddedCompIds.indexOf(compl.id) === -1) {
            dedupedArray.push(compl)
            alreadyAddedCompIds.push(compl.id)
          }
        })
        return dedupedArray
      }).catch(e => sendErrorForward('collect complication final promise', e, null))
    } else {
      return complication
    }
  })
}

module.exports = controllerObj