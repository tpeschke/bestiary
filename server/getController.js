const roles = require('./roles')
  , equipmentCtrl = require('./equipmentController')
  , combatSquareCtrl = require('./combatSquare')
  , { combatCounterSecretKey } = require('./server-config')
  , axios = require('axios')
const { sendErrorForwardNoFile, checkForContentTypeBeforeSending } = require('./helpers')

const sendErrorForward = sendErrorForwardNoFile('get controller')

function formatNameWithCommas(name) {
  if (name.includes(',')) {
    let nameArray = name.split(', ')
    return `${nameArray[1]} ${nameArray[0]}`
  }
  return name
}

function sortByStrength(a, b) {
  const order = ['majSt', 'minSt', 'minWk', 'majWk'];
  return order.indexOf(a.strength) - order.indexOf(b.strength)
}

function sortTemplateRoles(a, b) {
  const order = ['Novice', 'Apprentice', 'Journeyman', 'Expert', 'Master', 'Grandmaster', 'Legendary', 'Mythic'];
  return order.indexOf(a.name) - order.indexOf(b.name)
}

function sortOutAnyToTheBottom(a, b) {
  if ((a.trait === 'Any' && b.trait === 'Any') || (a.trait !== 'Any' && b.trait !== 'Any')) {
    return +b.value - +a.value
  }
  if (a.trait !== 'Any') {
    return -1
  } else {
    return 1
  }
}

function displayName(name, combatrole, secondarycombat, socialrole, skillrole, socialsecondary) {
  let nameString = ''
  let roles = false

  if (name) {
    nameString += name
  } else {
    name = ''
  }

  if (combatrole || socialrole || skillrole) {
    nameString += ' ['
    roles = true
  }
  if (combatrole) {
    nameString += `${combatrole}`
    if (secondarycombat) {
      nameString += ` (${secondarycombat})`
    }
  }
  if (socialrole) {
    if (nameString.length > name.length + 3) {
      nameString += '/'
    }
    nameString += `${socialrole}`
    if (socialsecondary) {
      nameString += ` (${socialsecondary})`
    }
  }
  if (skillrole) {
    if (nameString.length > name.length + 3) {
      nameString += '/'
    }
    nameString += `${skillrole}`
  }

  if (roles) {
    nameString += ']'
  }

  return nameString
}

function objectifyItemArray (itemArray) {
  let itemObject = {}
  itemArray.forEach(item => {
    itemObject[item.itemcategory] = item
  })
  return itemObject
}

module.exports = {
  getSpells: (req, res) => {
    const db = req.app.get('db')
    db.get.spellsByCount().then(result => {
      checkForContentTypeBeforeSending(res, result)
    }).catch(e => sendErrorForward('get spells by count', e, res))
  },
  getArtist: (req, res) => {
    const db = req.app.get('db')
      , id = req.params.id

    db.get.artistById(id).then(result => {
      checkForContentTypeBeforeSending(res, result)
    }).catch(e => sendErrorForward('get artist by id', e, res))
  },
  checkToken(req, res) {
    const id = req.params.id
    const endpoint = 'https://bonfire-beastiary.s3-us-west-1.amazonaws.com/' + id + '-token'
    axios.get(endpoint).then(_ => {
      checkForContentTypeBeforeSending(res, true)
    }).catch(e => {
      checkForContentTypeBeforeSending(res, false)
    })
  },
  getAllClimates(req, res) {
    db = req.app.get('db')
    db.get.all.climates().then(allclimates => {
      checkForContentTypeBeforeSending(res, allclimates)
    }).catch(e => sendErrorForward('beast all climates single', e, res))
  },
  getQuickView(req, res) {
    let { hash } = req.params
    let { secretKey, userpatreon, userid } = req.query
    let { modifiers } = req.body
    if (modifiers && !modifiers.pointModifier) {
      modifiers.pointModifier = 0
    } else if (!modifiers) {
      modifiers = { pointModifier: 0 }
    }
    let db
    req.db ? db = req.db : db = req.app.get('db')
    db.get.quickview(hash).then(result => {
      let { name, sp_atk, sp_def, vitality, panic, stress, roletype, baseskillrole, basesocialrole, secondaryroletype, skillrole, socialrole, basesecondaryrole, baseroletype, rolename, rolevitality, id: beastid, roleid, patreon, canplayerview, caution, roleattack, roledefense, rolepanic, rolestress, rolecaution, rolehash, basefatigue, basesocialsecondary, socialsecondary, size, rolesize, rolefatigue, mainpoints, rolepoints, notrauma, mainsingledievitality, mainknockback, mainpanicstrength, maincautionstrength, mainfatiguestrength, mainstressstrength, mainmental, mainlargeweapons, rolesingledievitality, roleknockback, rolepanicstrength, rolecautionstrength, rolefatiguestrength, rolestressstrength, rolemental, rolelargeweapons, rolenameorder, mainsocialpoints, rolesocialpoints, mainskillpoints, roleskillpoints, mainrollundertrauma, rolerollundertrauma } = result[0]
      let beast = { name, roleid, sp_atk, sp_def, vitality, panic, stress, hash, patreon, caution, roleattack, roledefense, size: rolesize ? rolesize : size, basefatigue, combatpoints: (rolepoints || rolepoints === 0 ? rolepoints : mainpoints) + modifiers.pointModifier, notrauma }
      let isARole = rolehash === req.params.hash
      let roleToUse = ''
      let secondaryRoleToUse = ''

      name = formatNameWithCommas(beast.name)

      if (!isARole) {
        beast.name = displayName(beast.name, baseroletype, basesecondaryrole, baseskillrole, basesocialrole, basesocialsecondary)
        beast.role = baseroletype
        beast.secondaryrole = basesecondaryrole
        beast.singledievitality = mainsingledievitality
        beast.knockback = mainknockback
        beast.panicstrength = mainpanicstrength
        beast.cautionstrength = maincautionstrength
        beast.fatiguestrength = mainfatiguestrength
        beast.stressstrength = mainstressstrength
        beast.mental = mainmental
        beast.largeweapons = mainlargeweapons
        beast.skillpoints = mainskillpoints + modifiers.pointModifier
        beast.socialpoints = mainsocialpoints + modifiers.pointModifier
        beast.rollundertrauma = mainrollundertrauma
      }

      if (rolename && rolename.toUpperCase() !== "NONE") {
        if (rolenameorder === '1') {
          name = name + " " + rolename
        } else if (rolenameorder === '3') {
          name = rolename
        } else {
          name = rolename + " " + name
        }
      }

      if (baseroletype) {
        roleToUse = baseroletype
        secondaryRoleToUse = basesecondaryrole

        if (roleToUse !== '' && secondaryRoleToUse) {
          beast.name = name + ` [${roleToUse}(${secondaryRoleToUse})]`
        } else if (roleToUse !== '') {
          beast.name = name + ` [${roleToUse}]`
        } else {
          beast.name = name
        }
        beast.secondary = basesecondaryrole
        beast.role = baseroletype
      }

      if (isARole) {
        roleToUse = roletype
        secondaryRoleToUse = secondaryroletype

        beast.singledievitality = rolesingledievitality
        beast.knockback = roleknockback
        beast.panicstrength = rolepanicstrength
        beast.cautionstrength = rolecautionstrength
        beast.fatiguestrength = rolefatiguestrength
        beast.stressstrength = rolestressstrength
        beast.mental = rolemental
        beast.largeweapons = rolelargeweapons
        beast.skillpoints = roleskillpoints + modifiers.pointModifier
        beast.socialpoints = rolesocialpoints + modifiers.pointModifier
        beast.role = roleToUse
        beast.secondaryrole = secondaryroletype
        beast.rollundertrauma = rolerollundertrauma

        if (roletype) {
          if (roleToUse !== '' && secondaryRoleToUse) {
            beast.name = name + ` [${roleToUse}(${secondaryRoleToUse})]`
          } else if (roleToUse !== '') {
            beast.name = name + ` [${roleToUse}]`
          } else {
            beast.name = name
          }
        }
        if (roletype) {
          beast.role = roletype
        }
      }

      if (modifiers.modifierTerm) {
        beast.name = `${modifiers.modifierTerm} ${beast.name}`
      }

      let promiseArray = []
        , patreonTestValue = -1;

      let beastPatreon = beast.patreon === 0 ? beast.patreon + 3 : beast.patreon

      if (canplayerview) {
        patreonTestValue = 1000
      } else if (secretKey === combatCounterSecretKey && userpatreon) {
        if (userid === 1 || userid === 21) {
          patreonTestValue = 1000
        } else if (userid && userpatreon) {
          patreonTestValue = userpatreon
        }
      } else if (req.user) {
        if (req.user.id === 1 || req.user.id === 21) {
          patreonTestValue = 1000
        } else if (req.user && req.user.patreon) {
          patreonTestValue = req.user.patreon
        }
      }

      if (beastPatreon > patreonTestValue) {
        checkForContentTypeBeforeSending(res, { color: 'red', message: 'You need to update your Patreon tier to access this monster' })
      } else {
        promiseArray.push(db.get.spellsByRole(beastid, roleid).then(spells => {
          if (spells.length > 0) {
            return db.get.casting(beastid).then(castingTypes => {
              beast.casting = castingTypes[0]
              beast.spells = spells
              return true
            })
          } else {
            return true
          }
        }))

        promiseArray.push(db.get.movement(beastid).then(result => {
          if (roleid) {
            result = result.filter(movementType => movementType.roleid === roleid || movementType.allroles)
            if (result.length === 0) {
              result = result.filter(movementType => !movementType.roleid)
            }
          }
          beast.movement = result.map(movementType => {
            movementType.role = roleToUse
            movementType.points = beast.combatpoints
            return combatSquareCtrl.getMovementDirectly(movementType).movementSpeeds
          })
          return result
        }).catch(e => sendErrorForward('movement', e, res)))

        promiseArray.push(db.get.combatStatArray(beastid).then(result => {
          if (isARole) {
            result = result.filter(weapon => weapon.roleid === roleid)
            if (result.length === 0) {
              result = result.filter(weapon => !weapon.roleid)
            }
          } else {
            result = result.filter(weapon => !weapon.roleid)
          }

          beast.combatStatArray = result.map(combatSquare => {
            if (req.body.combat && req.body.combat.length > 0) {
              let { combat: combatReplacement } = req.body
              const index = combatReplacement.findIndex(i => i.id === combatSquare.id)
              if (index > -1) {
                combatSquare.weapon = combatReplacement[index].weapon
                combatSquare.armor = combatReplacement[index].armor
                combatSquare.shield = combatReplacement[index].shield
              }
            }

            let equipmentBonuses = { weaponInfo: null, armorInfo: null, shieldInfo: null }
            if (combatSquare.weapon) {
              equipmentBonuses.weaponInfo = equipmentCtrl.getWeapon(combatSquare.weapon).bonusLong
            }
            if (combatSquare.armor) {
              equipmentBonuses.armorInfo = equipmentCtrl.getArmor(combatSquare.armor).bonusLong
            }
            if (combatSquare.shield) {
              equipmentBonuses.shieldInfo = equipmentCtrl.getShield(combatSquare.shield).bonusLong
            }

            combatSquare.equipmentBonuses = equipmentBonuses

            let fullCombatSquare = combatSquareCtrl.getSquareDirectly({ combatStats: combatSquare, points: beast.combatpoints, size: beast.size, role: roleToUse })

            fullCombatSquare.weaponname = combatSquare.weaponname,
              fullCombatSquare.weapon = combatSquare.weapon,
              fullCombatSquare.armor = combatSquare.armor,
              fullCombatSquare.shield = combatSquare.shield

            return { combatSquare: fullCombatSquare, combatStats: combatSquare, roleid: combatSquare.roleid, isspecial: combatSquare.isspecial, eua: combatSquare.eua, tdr: combatSquare.tdr, info: combatSquare.info, weaponname: combatSquare.weaponname, weapon: combatSquare.weapon, armor: combatSquare.armor, shield: combatSquare.shield }
          })

          let armor = null
            , shield = null
          if (beast.combatStatArray[0]) {
            armor = beast.combatStatArray[0].armor
            shield = beast.combatStatArray[0].shield
          }
          beast.phyiscalAndStress = combatSquareCtrl.setVitalityAndStressDirectly(beast.combatpoints, Math.max(beast.combatpoints, beast.skillpoints, beast.socialpoints), beast.role, { mental: beast.mental, panic: beast.panicstrength, caution: beast.cautionstrength, fatigue: beast.fatiguestrength, largeweapons: beast.largeweapons, singledievitality: beast.singledievitality, noknockback: beast.noknockback }, beast.secondaryrole, beast.knockback, beast.size ? beast.size : 'Medium', armor, shield)
          let { physicalMental } = req.body
          if (physicalMental && physicalMental.currentDamage) {
            beast.phyiscalAndStress.physical.currentDamage = +physicalMental.currentDamage
          }
          if (physicalMental && physicalMental.currentStress) {
            beast.phyiscalAndStress.mental.currentStress = +physicalMental.currentStress
          }
          return result
        }).catch(e => sendErrorForward('quick view combat', e, res)))

        promiseArray.push(db.get.locationalvitality(beastid).then(result => {
          if (isARole) {
            beast.locationalvitality = result.filter(location => location.roleid === roleid)
            if (beast.locationalvitality.length === 0) {
              beast.locationalvitality = result.filter(location => !location.roleid)
            }
          } else {
            beast.locationalvitality = result
          }

          let { physicalMental } = req.body
          if (physicalMental && !!Object.keys(physicalMental.locationalDamage).length) {
            beast.locationalvitality.map(location => {
              if (physicalMental.locationalDamage[location.id]) {
                location.currentDamage = physicalMental.locationalDamage[location.id]
              }
              return location
            })
          }
          return result
        }))

        Promise.all(promiseArray).then(finalArray => {
          checkForContentTypeBeforeSending(res, beast)
        }).catch(e => sendErrorForward('quick view final promise', e, res))
      }
    }).catch(e => sendErrorForward('main', e, res))
  },
  getSingleBeast(req, res) {
    const id = +req.params.id
    let db
    req.db ? db = req.db : db = req.app.get('db')

    db.get.mainInfo(id).then(result => {
      let beast = result[0]
        , promiseArray = []
      let patreonTestValue = -1;
      let patreon = beast.patreon === 0 ? beast.patreon + 3 : beast.patreon

      beast.panic = beast.panicstrength
      beast.caution = beast.cautionstrength
      beast.fatigue = beast.fatiguestrength

      if (beast.canplayerview) {
        patreonTestValue = 1000
      } else if (req.user) {
        if (req.user.id === 1 || req.user.id === 21) {
          patreonTestValue = 1000
        } else if (req.user && req.user.patreon) {
          patreonTestValue = req.user.patreon
        }
      }

      if (patreon > patreonTestValue) {
        checkForContentTypeBeforeSending(res, { color: 'red', message: 'You need to update your Patreon tier to access this monster' })
      } else {
        beast.lairloot = {};

        promiseArray.push(db.get.types(id).then(result => {
          beast.types = result
          return result
        }).catch(e => sendErrorForward('beast types', e, res)))

        promiseArray.push(db.get.climates(id).then(result => {
          beast.climates = { beast: result }
          return db.get.all.climates().then(allclimates => {
            beast.climates.allclimates = allclimates
          }).catch(e => sendErrorForward('beast all climates', e, res))
        }).catch(e => sendErrorForward('beast climates', e, res)))

        beast.artistInfo = {}
        if (req.query.edit === 'true') {
          promiseArray.push(db.get.artist(id).then(result => {
            beast.artistInfo = { ...beast.artistInfo, ...result[0] }
          }).catch(e => sendErrorForward('beast artist', e, res)))
          promiseArray.push(db.get.all.artists(id).then(result => {
            beast.artistInfo = { ...beast.artistInfo, allartists: [...result] }
          }).catch(e => sendErrorForward('beast all artists', e, res)))
        } else {
          promiseArray.push(db.get.artist(id).then(result => {
            beast.artistInfo = { ...beast.artistInfo, ...result[0] }
          }).catch(e => sendErrorForward('beast artist 2', e, res)))
        }

        if (req.query.edit === 'true') {
          promiseArray.push(db.get.conflictedit(id).then(result => {
            beast.conflict = { descriptions: [], convictions: [], devotions: [], flaws: [], burdens: [] }
            result.forEach(val => {
              if (val.type === 't' || val.type === 'c' || !val.type) {
                beast.conflict.convictions.push(val)
              } else if (val.type === 'd') {
                beast.conflict.devotions.push(val)
              } else if (val.type === 'f') {
                beast.conflict.flaws.push(val)
              } else if (val.type === 'b') {
                beast.conflict.burdens.push(val)
              } else if (val.type === 'h') {
                beast.conflict.descriptions.push(val)
              }
            })
            return result
          }).catch(e => sendErrorForward('beast confrontation 1', e, res)))
        } else {
          promiseArray.push(db.get.conflict(id).then(result => {
            beast.conflict = { descriptions: [], convictions: [], devotions: [], flaws: [], burdens: [] }
            result.forEach(val => {
              if (val.type === 't' || val.type === 'c' || !val.type) {
                if (beast.traitlimit && beast.conflict.convictions.length < beast.traitlimit) {
                  beast.conflict.convictions.push(val)
                } else if (!beast.traitlimit) {
                  beast.conflict.convictions.push(val)
                }
              } else if (val.type === 'd') {
                if (beast.devotionlimit && beast.conflict.devotions.length < beast.devotionlimit) {
                  beast.conflict.devotions.push(val)
                } else if (!beast.devotionlimit) {
                  beast.conflict.devotions.push(val)
                }
              } else if (val.type === 'f') {
                if (beast.flawlimit && beast.conflict.flaws.length < beast.flawlimit) {
                  beast.conflict.flaws.push(val)
                } else if (!beast.flawlimit) {
                  beast.conflict.flaws.push(val)
                }
              } else if (val.type === 'b') {
                beast.conflict.burdens.push(val)
              } else if (val.type === 'h') {
                beast.conflict.descriptions.push(val)
              }
            })

            beast.conflict.descriptions = beast.conflict.descriptions.sort(sortByStrength)
            beast.conflict.convictions = beast.conflict.convictions.sort(sortByStrength)
            beast.conflict.flaws = beast.conflict.flaws.sort(sortOutAnyToTheBottom)
            beast.conflict.burdens = beast.conflict.burdens.sort(sortOutAnyToTheBottom)

            return result
          }).catch(e => sendErrorForward('beast conflict', e, res)))
        }

        promiseArray.push(db.get.skill(id).then(result => {
          beast.skills = result.sort((a, b) => +b.rank - +a.rank)
          return result
        }).catch(e => sendErrorForward('beast skills', e, res)))

        if (req.user && req.user.id) {
          promiseArray.push(db.get.favorite(req.user.id, id).then(result => {
            if (result.length > 0) {
              beast.favorite = true
            } else {
              beast.favorite = false
            }
          }).catch(e => sendErrorForward('beast favorite', e, res)))
        } else {
          beast.favorite = false
        }

        if (req.user) {
          promiseArray.push(db.get.notes(id, req.user.id).then(result => {
            beast.notes = result[0] || {}
            return result
          }).catch(e => sendErrorForward('beast notes', e, res)))
        }

        promiseArray.push(db.get.variants(id).then(result => {
          beast.variants = result
          return result
        }).catch(e => sendErrorForward('beast variants', e, res)))

        promiseArray.push(db.get.loot(id).then(result => {
          beast.loot = result
          return result
        }).catch(e => sendErrorForward('beast loot', e, res)))

        promiseArray.push(db.get.reagents(id).then(result => {
          beast.reagents = result
          return result
        }).catch(e => sendErrorForward('beast pleroma', e, res)))

        promiseArray.push(db.get.locationalvitality(id).then(result => {
          beast.locationalvitality = result
          return result
        }).catch(e => sendErrorForward('beast locational vitality', e, res)))

        promiseArray.push(db.get.folklore(id).then(result => {
          beast.folklore = result
          return result
        }).catch(e => sendErrorForward('beast folklore', e, res)))

        promiseArray.push(db.get.loot.lairbasic(id).then(result => {
          beast.lairloot = { ...result[0], ...beast.lairloot }
          return result
        }).catch(e => sendErrorForward('beast basic', e, res)))

        promiseArray.push(db.get.loot.lairalms(id).then(result => {
          beast.lairloot = { alms: result, ...beast.lairloot }
          return result
        }).catch(e => sendErrorForward('beast alms', e, res)))

        promiseArray.push(db.get.loot.lairitems(id).then(result => {
          if (req.query.edit === 'true') { 
            beast.lairloot = { items: objectifyItemArray(result), ...beast.lairloot }
          } else {
            beast.lairloot = { items: result, ...beast.lairloot }
          }
          return result
        }).catch(e => sendErrorForward('beast items', e, res)))

        promiseArray.push(db.get.loot.lairscrolls(id).then(result => {
          beast.lairloot = { scrolls: result, ...beast.lairloot }
          return result
        }).catch(e => sendErrorForward('beast scrolls', e, res)))

        promiseArray.push(db.get.loot.carriedbasic(id).then(result => {
          beast.carriedloot = { ...result[0], ...beast.carriedloot }
          return result
        }).catch(e => sendErrorForward('beast carried basic', e, res)))

        promiseArray.push(db.get.loot.carriedalms(id).then(result => {
          beast.carriedloot = { alms: result, ...beast.carriedloot }
          return result
        }).catch(e => sendErrorForward('beast carried alms', e, res)))

        promiseArray.push(db.get.loot.carrieditems(id).then(result => {
          if (req.query.edit === 'true') { 
            beast.carriedloot = { items: objectifyItemArray(result), ...beast.carriedloot }
          } else {
            beast.carriedloot = { items: result, ...beast.carriedloot }
          }
          return result
        }).catch(e => sendErrorForward('beast carried items', e, res)))

        promiseArray.push(db.get.loot.carriedscrolls(id).then(result => {
          beast.carriedloot = { scrolls: result, ...beast.carriedloot }
          return result
        }).catch(e => sendErrorForward('beast carried scrolls', e, res)))

        promiseArray.push(db.get.ranks(id).then(result => {
          beast.ranks = result
          return result
        }).catch(e => sendErrorForward('beast carried ranks', e, res)))

        beast.tables = {
          habitat: [],
          attack: [],
          defense: [],
          appearance: []
        }

        promiseArray.push(db.get.tableinfo(id).then(result => {
          let tablePromiseArray = []
          result.map(table => {
            tablePromiseArray.push(db.get.rows(table.id).then(rows => {
              if (table.section === 'ap') {
                beast.tables.appearance.push({
                  ...table,
                  rows
                })
              } else if (table.section === 'ha') {
                beast.tables.habitat.push({
                  ...table,
                  rows
                })
              } else if (table.section === 'at') {
                beast.tables.attack.push({
                  ...table,
                  rows
                })
              } else if (table.section === 'de') {
                beast.tables.defense.push({
                  ...table,
                  rows
                })
              }
              return true
            }).catch(e => sendErrorForward('beast table rows', e, res)))
          })
          return Promise.all(tablePromiseArray).then(finalArray => {
            return true
          }).catch(e => sendErrorForward('beast tables final promise', e, res))
        }).catch(e => sendErrorForward('beast tables', e, res)))

        promiseArray.push(db.get.roles(id).then(result => {
          beast.roles = result

          if (beast.name.includes('Template')) {
            beast.roles = beast.roles.sort(sortTemplateRoles)
          }
          beast.roleInfo = {}

          for (i = 0; i < result.length; i++) {
            beast.roleInfo[result[i].id] = {
              vitality: result[i].vitality,
              hash: result[i].hash,
              name: result[i].name,
              uniqueCombat: result[i].combatcount > 0,
              uniqueMovement: result[i].movementcount > 0,
              uniqueLocationalVitality: result[i].locationvitalitycount > 0,
              role: result[i].role,
              secondaryrole: result[i].secondaryrole,
              attack: result[i].attack,
              defense: result[i].defense,
              combatpoints: result[i].combatpoints,
              stress: result[i].stress,
              socialrole: result[i].socialrole,
              socialpoints: result[i].socialpoints,
              skillrole: result[i].skillrole,
              skillpoints: result[i].skillpoints,
              socialsecondary: result[i].socialsecondary,
              size: result[i].size,
              fatigue: result[i].fatiguestrength,
              mental: result[i].mental,
              panic: result[i].panicstrength,
              caution: result[i].cautionstrength,
              knockback: result[i].knockback,
              largeweapons: result[i].largeweapons,
              singledievitality: result[i].singledievitality,
              noknockback: result[i].noknockback,
              descriptionshare: result[i].descriptionshare,
              convictionshare: result[i].convictionshare,
              devotionshare: result[i].devotionshare,
              rollundertrauma: result[i].rollundertrauma,
              attack_conf: result[i].attack_conf,
              defense_conf: result[i].defense_conf,
              attack_skill: result[i].attack_skill,
              defense_skill: result[i].defense_skill,
            }
          }
          return result
        }).catch(e => sendErrorForward('beast roles', e, res)))

        promiseArray.push(db.get.casting(id).then(result => {
          beast.casting = result[0]
        }).catch(e => sendErrorForward('beast casting', e, res)))

        promiseArray.push(db.get.spells(id).then(result => {
          beast.spells = result
        }).catch(e => sendErrorForward('beast spells', e, res)))

        promiseArray.push(db.get.challenges(id).then(result => {
          beast.challenges = result
        }).catch(e => sendErrorForward('beast challenges', e, res)))

        promiseArray.push(db.get.obstacles(id).then(result => {
          beast.obstacles = result
        }).catch(e => sendErrorForward('beast obstalces view', e, res)))

        Promise.all(promiseArray).then(finalArray => {
          finalPromise = [];

          beast.tables.appearance.sort((a, b) => a.label.localeCompare(b.label))
          beast.tables.habitat.sort((a, b) => a.label.localeCompare(b.label))
          beast.tables.attack.sort((a, b) => a.label.localeCompare(b.label))
          beast.tables.defense.sort((a, b) => a.label.localeCompare(b.label))

          finalPromise.push(db.get.movement(id).then(result => {
            beast.movement = result.map(movementType => {
              const points = movementType.roleid ? beast.roleInfo[movementType.roleid].combatpoints : beast.combatpoints
              const role = movementType.roleid ? beast.roleInfo[movementType.roleid].role : beast.role
              movementType.role = role
              movementType.points = points
              return combatSquareCtrl.getMovementDirectly(movementType)
            })

            return true
          }).catch(e => sendErrorForward('beast movement 2', e, res)))

          finalPromise.push(db.get.combatStatArray(id).then(result => {
            if (req.query.edit === 'true') {
              beast.combatStatArray = result
            } else {
              beast.combatStatArray = result.map(combatSquare => {
                const points = combatSquare.roleid ? beast.roleInfo[combatSquare.roleid].combatpoints : beast.combatpoints
                const size = combatSquare.roleid && beast.roleInfo[combatSquare.roleid].size ? beast.roleInfo[combatSquare.roleid].size : beast.size ? beast.size : 'Medium'
                const role = combatSquare.roleid ? beast.roleInfo[combatSquare.roleid].role : beast.role

                let equipmentBonuses = { weaponInfo: null, armorInfo: null, shieldInfo: null }
                if (combatSquare.weapon) {
                  equipmentBonuses.weaponInfo = equipmentCtrl.getWeapon(combatSquare.weapon).bonusLong
                }
                if (combatSquare.armor) {
                  equipmentBonuses.armorInfo = equipmentCtrl.getArmor(combatSquare.armor).bonusLong
                }
                if (combatSquare.shield) {
                  equipmentBonuses.shieldInfo = equipmentCtrl.getShield(combatSquare.shield).bonusLong
                }

                combatSquare.equipmentBonuses = equipmentBonuses

                let fullCombatSquare = combatSquareCtrl.getSquareDirectly({ combatStats: combatSquare, points, size, role })

                fullCombatSquare.weaponname = combatSquare.weaponname,
                  fullCombatSquare.weapon = combatSquare.weapon,
                  fullCombatSquare.armor = combatSquare.armor,
                  fullCombatSquare.shield = combatSquare.shield

                return { combatSquare: fullCombatSquare, combatStats: combatSquare, roleid: combatSquare.roleid, isspecial: combatSquare.isspecial, eua: combatSquare.eua, tdr: combatSquare.tdr }
              })

              let armor = null
                , shield = null
              if (beast.combatStatArray[0]) {
                armor = beast.combatStatArray[0].armor
                shield = beast.combatStatArray[0].shield
              }
              beast.phyiscalAndStress = combatSquareCtrl.setVitalityAndStressDirectly(beast.combatpoints, Math.max(beast.combatpoints, beast.skillpoints, beast.socialpoints), beast.role, { mental: beast.mental, panic: beast.panicstrength, caution: beast.cautionstrength, fatigue: beast.fatiguestrength, largeweapons: beast.largeweapons, singledievitality: beast.singledievitality, noknockback: beast.noknockback }, beast.secondaryrole, beast.knockback, beast.size ? beast.size : 'Medium', armor, shield)
              for (let role in beast.roleInfo) {
                beast.roleInfo[role].phyiscalAndStress = combatSquareCtrl.setVitalityAndStressDirectly(beast.roleInfo[role].combatpoints, Math.max(beast.roleInfo[role].combatpoints, beast.roleInfo[role].skillpoints, beast.roleInfo[role].socialpoints), beast.roleInfo[role].role, { mental: beast.roleInfo[role].mental, panic: beast.roleInfo[role].panic, caution: beast.roleInfo[role].caution, fatigue: beast.roleInfo[role].fatigue, largeweapons: beast.roleInfo[role].largeweapons, singledievitality: beast.roleInfo[role].singledievitality, noknockback: beast.roleInfo[role].noknockback }, beast.roleInfo[role].secondaryrole, beast.roleInfo[role].knockback, beast.roleInfo[role].size ? beast.roleInfo[role].size : beast.size ? beast.size : 'Medium', armor, shield)
              }
            }
            return result
          }).catch(e => sendErrorForward('beast combat 2', e, res)))

          if (req.query.edit !== 'true') {
            beast.conflict.devotions.forEach(val => {
              if (val.trait.toUpperCase() === 'ANY') {
                finalPromise.push(db.get.randomdevotion().then(result => {
                  val.trait = result[0].trait
                }).catch(e => sendErrorForward('beast random devotion', e, res)))
              }
            })
          }

          Promise.all(finalPromise).then(actualFinal => {
            beast.conflict.devotions = beast.conflict.devotions.sort(sortOutAnyToTheBottom)
            checkForContentTypeBeforeSending(res, beast)
          }).catch(e => sendErrorForward('beast final promise 2', e, res))
        }).catch(e => sendErrorForward('beast main promise', e, res))
      }
    }).catch(e => sendErrorForward('beast main', e, res))
  },
}