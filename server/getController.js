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

module.exports = {
  getSpells: (req, res) => {
    const db = req.app.get('db')
    db.get.spells_by_count().then(result => {
      checkForContentTypeBeforeSending(res, result)
    }).catch(e => sendErrorForward('get spells by count', e, res))
  },
  getArtist: (req, res) => {
    const db = req.app.get('db')
      , id = req.params.id

    db.get.artist_by_id(id).then(result => {
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
    db.get.all_climates().then(allclimates => {
      checkForContentTypeBeforeSending(res, allclimates)
    }).catch(e => sendErrorForward('beast all climates single', e, res))
  },
  getQuickView(req, res) {
    let { hash } = req.params
    let { secretKey, userpatreon, userid } = req.query
    let db
    req.db ? db = req.db : db = req.app.get('db')
    db.get.quickview(hash).then(result => {
      let { name, sp_atk, sp_def, vitality, panic, stress, roletype, baseskillrole, basesocialrole, secondaryroletype, skillrole, socialrole, basesecondaryrole, baseroletype, rolename, rolevitality, id: beastid, roleid, patreon, canplayerview, caution, roleattack, roledefense, rolepanic, rolestress, rolecaution, rolehash, basefatigue, basesocialsecondary, socialsecondary, size, rolesize, rolefatigue, mainpoints, rolepoints, notrauma, mainsingledievitality, mainknockback, mainpanicstrength, maincautionstrength, mainfatiguestrength, mainstressstrength, mainmental, mainlargeweapons, rolesingledievitality, roleknockback, rolepanicstrength, rolecautionstrength, rolefatiguestrength, rolestressstrength, rolemental, rolelargeweapons, rolenameorder, mainsocialpoints, rolesocialpoints, mainskillpoints, roleskillpoints } = result[0]
      let beast = { name, sp_atk, sp_def, vitality, panic, stress, hash, patreon, caution, roleattack, roledefense, size: rolesize ? rolesize : size, basefatigue, combatpoints: rolepoints || rolepoints === 0 ? rolepoints : mainpoints, notrauma }
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
        beast.skillpoints = mainskillpoints
        beast.socialpoints = mainsocialpoints
      }

      if (rolename && rolename.toUpperCase() !== "NONE") {
        if (rolenameorder === '1') {
          name = name + " " + rolename
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
        beast.skillpoints = roleskillpoints
        beast.socialpoints = rolesocialpoints

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
        promiseArray.push(db.get.beastmovement(beastid).then(result => {
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

          let specialAbilities = []
          beast.combatStatArray = result.map(combatSquare => {
            let specialAbilities = {}
            let fullCombatSquare = combatSquareCtrl.getSquareDirectly({ combatStats: combatSquare, points: beast.combatpoints, size: beast.size, role: roleToUse })
            let equipmentInfo = {}
            if (combatSquare.weapon) {
              equipmentInfo.weaponInfo = equipmentCtrl.getWeapon(combatSquare.weapon)
            }
            if (combatSquare.armor) {
              equipmentInfo.armorInfo = equipmentCtrl.getArmor(combatSquare.armor)
            }
            if (combatSquare.shield) {
              equipmentInfo.shieldInfo = equipmentCtrl.getShield(combatSquare.shield)
            }

            if (equipmentInfo.weaponInfo && equipmentInfo.weaponInfo.bonusLong && (!combatSquare.weapon || combatSquare.weapon.includes(equipmentInfo.weaponInfo.name))) {
              if (!specialAbilities[combatSquare.roleid]) {
                specialAbilities[combatSquare.roleid] = []
              }
              specialAbilities[combatSquare.roleid].push(equipmentInfo.weaponInfo.bonusLong)
            }
            if (equipmentInfo.shieldInfo && equipmentInfo.shieldInfo.bonusLong && (!combatSquare.shield || combatSquare.shield.includes(equipmentInfo.shieldInfo.name))) {
              if (!specialAbilities[combatSquare.roleid]) {
                specialAbilities[combatSquare.roleid] = []
              }
              specialAbilities[combatSquare.roleid].push(equipmentInfo.shieldInfo.bonusLong)
            }

            fullCombatSquare.weaponname = combatSquare.weaponname,
              fullCombatSquare.weapon = combatSquare.weapon,
              fullCombatSquare.armor = combatSquare.armor,
              fullCombatSquare.shield = combatSquare.shield

            return { combatSquare: fullCombatSquare, combatStats: combatSquare, roleid: combatSquare.roleid, isspecial: combatSquare.isspecial, eua: combatSquare.eua, tdr: combatSquare.tdr, weaponname: combatSquare.weaponname, weapon: combatSquare.weapon, armor: combatSquare.armor, shield: combatSquare.shield }
          })

          for (const key in specialAbilities) {
            let deduped = specialAbilities[key].filter((c, index) => specialAbilities[key].indexOf(c) === index)
            specialAbilities[key] = deduped
          }
          beast.specialAbilities = specialAbilities;

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
          return result
        }).catch(e => sendErrorForward('combat', e, res)))

        promiseArray.push(db.get.locationalvitality(beastid).then(result => {
          if (isARole) {
            beast.locationalvitality = result.filter(location => location.roleid === roleid)
            if (beast.locationalvitality.length === 0) {
              beast.locationalvitality = result.filter(location => !location.roleid)
            }
          } else {
            beast.locationalvitality = result
          }
          return result
        }))

        Promise.all(promiseArray).then(finalArray => {
          checkForContentTypeBeforeSending(res, beast)
        }).catch(e => sendErrorForward('final promise', e, res))
      }
    }).catch(e => sendErrorForward('main', e, res))
  },
  getSingleBeast(req, res) {
    const id = +req.params.id
    let db
    req.db ? db = req.db : db = req.app.get('db')
    db.get.beastmaininfo(id).then(result => {
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

        promiseArray.push(db.get.beasttypes(id).then(result => {
          beast.types = result
          return result
        }).catch(e => sendErrorForward('beast types', e, res)))

        promiseArray.push(db.get.climates(id).then(result => {
          beast.climates = { beast: result }
          return db.get.all_climates().then(allclimates => {
            beast.climates.allclimates = allclimates
          }).catch(e => sendErrorForward('beast all climates', e, res))
        }).catch(e => sendErrorForward('beast climates', e, res)))

        beast.artistInfo = {}
        if (req.query.edit === 'true') {
          promiseArray.push(db.get.artist(id).then(result => {
            beast.artistInfo = { ...beast.artistInfo, ...result[0] }
          }).catch(e => sendErrorForward('beast artist', e, res)))
          promiseArray.push(db.get.allartists(id).then(result => {
            beast.artistInfo = { ...beast.artistInfo, allartists: [...result] }
          }).catch(e => sendErrorForward('beast all artists', e, res)))
        } else {
          promiseArray.push(db.get.artist(id).then(result => {
            beast.artistInfo = { ...beast.artistInfo, ...result[0] }
          }).catch(e => sendErrorForward('beast artist 2', e, res)))
        }

        if (req.query.edit === 'true') {
          promiseArray.push(db.get.beastconflictedit(id).then(result => {
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
          promiseArray.push(db.get.beastconflict(id).then(result => {
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

        promiseArray.push(db.get.beastskill(id).then(result => {
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
          promiseArray.push(db.get.beastnotes(id, req.user.id).then(result => {
            beast.notes = result[0] || {}
            return result
          }).catch(e => sendErrorForward('beast notes', e, res)))
        }

        promiseArray.push(db.get.beastvariants(id).then(result => {
          beast.variants = result
          return result
        }).catch(e => sendErrorForward('beast variants', e, res)))

        promiseArray.push(db.get.beastloot(id).then(result => {
          beast.loot = result
          return result
        }).catch(e => sendErrorForward('beast loot', e, res)))

        promiseArray.push(db.get.beastreagents(id).then(result => {
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

        promiseArray.push(db.get.loot.lairequipment(id).then(result => {
          beast.lairloot = { equipment: result, ...beast.lairloot }
          return result
        }).catch(e => sendErrorForward('beast equipment', e, res)))

        promiseArray.push(db.get.loot.lairscrolls(id).then(result => {
          beast.lairloot = { scrolls: result, ...beast.lairloot }
          return result
        }).catch(e => sendErrorForward('beast scrolls', e, res)))

        promiseArray.push(db.get.loot.lairtraited(id).then(result => {
          beast.lairloot = { traited: result, ...beast.lairloot }
          return result
        }).catch(e => sendErrorForward('beast superior', e, res)))

        promiseArray.push(db.get.loot.carriedbasic(id).then(result => {
          beast.carriedloot = { ...result[0], ...beast.carriedloot }
          return result
        }).catch(e => sendErrorForward('beast carried basic', e, res)))

        promiseArray.push(db.get.loot.carriedalms(id).then(result => {
          beast.carriedloot = { alms: result, ...beast.carriedloot }
          return result
        }).catch(e => sendErrorForward('beast carried alms', e, res)))

        promiseArray.push(db.get.loot.carriedequipment(id).then(result => {
          beast.carriedloot = { equipment: result, ...beast.carriedloot }
          return result
        }).catch(e => sendErrorForward('beast carried equipment', e, res)))

        promiseArray.push(db.get.loot.carriedscrolls(id).then(result => {
          beast.carriedloot = { scrolls: result, ...beast.carriedloot }
          return result
        }).catch(e => sendErrorForward('beast carried scrolls', e, res)))

        promiseArray.push(db.get.loot.carriedtraited(id).then(result => {
          beast.carriedloot = { traited: result, ...beast.carriedloot }
          return result
        }).catch(e => sendErrorForward('beast carried superior', e, res)))

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

        promiseArray.push(db.get.beastroles(id).then(result => {
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
              rollundertrauma: result[i].rollundertrauma
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

          finalPromise.push(db.get.beastmovement(id).then(result => {
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
              let specialAbilities = {}
              beast.combatStatArray = result.map(combatSquare => {
                const points = combatSquare.roleid ? beast.roleInfo[combatSquare.roleid].combatpoints : beast.combatpoints
                const size = combatSquare.roleid && beast.roleInfo[combatSquare.roleid].size ? beast.roleInfo[combatSquare.roleid].size : beast.size ? beast.size : 'Medium'
                const role = combatSquare.roleid ? beast.roleInfo[combatSquare.roleid].role : beast.role
                let fullCombatSquare = combatSquareCtrl.getSquareDirectly({ combatStats: combatSquare, points, size, role })

                let equipmentInfo = {}
                if (combatSquare.weapon) {
                  equipmentInfo.weaponInfo = equipmentCtrl.getWeapon(combatSquare.weapon)
                }
                if (combatSquare.armor) {
                  equipmentInfo.armorInfo = equipmentCtrl.getArmor(combatSquare.armor)
                }
                if (combatSquare.shield) {
                  equipmentInfo.shieldInfo = equipmentCtrl.getShield(combatSquare.shield)
                }

                if (equipmentInfo.weaponInfo && equipmentInfo.weaponInfo.bonusLong && (!combatSquare.weapon || combatSquare.weapon.includes(equipmentInfo.weaponInfo.name))) {
                  if (!specialAbilities[combatSquare.roleid]) {
                    specialAbilities[combatSquare.roleid] = []
                  }
                  specialAbilities[combatSquare.roleid].push(equipmentInfo.weaponInfo.bonusLong)
                }
                if (equipmentInfo.shieldInfo && equipmentInfo.shieldInfo.bonusLong && (!combatSquare.shield || combatSquare.shield.includes(equipmentInfo.shieldInfo.name))) {
                  if (!specialAbilities[combatSquare.roleid]) {
                    specialAbilities[combatSquare.roleid] = []
                  }
                  specialAbilities[combatSquare.roleid].push(equipmentInfo.shieldInfo.bonusLong)
                }

                fullCombatSquare.weaponname = combatSquare.weaponname,
                  fullCombatSquare.weapon = combatSquare.weapon,
                  fullCombatSquare.armor = combatSquare.armor,
                  fullCombatSquare.shield = combatSquare.shield

                return { combatSquare: fullCombatSquare, combatStats: combatSquare, roleid: combatSquare.roleid, isspecial: combatSquare.isspecial, eua: combatSquare.eua, tdr: combatSquare.tdr }
              })

              for (const key in specialAbilities) {
                let deduped = specialAbilities[key].filter((c, index) => specialAbilities[key].indexOf(c) === index)
                specialAbilities[key] = deduped
              }
              beast.specialAbilities = specialAbilities;

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