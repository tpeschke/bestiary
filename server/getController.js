const equipmentCtrl = require('./equipmentController')

function formatNameWithCommas(name) {
  if (name.includes(',')) {
    let nameArray = name.split(', ')
    return `${nameArray[1]} ${nameArray[0]}`
  }
  return name
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
  getQuickView(req, res) {
    let { hash } = req.params
    let db
    req.db ? db = req.db : db = req.app.get('db')
    db.get.quickview(hash).then(result => {
      let { name, sp_atk, sp_def, vitality, panic, stress, roletype, baseskillrole, basesocialrole, secondaryroletype, skillrole, socialrole, basesecondaryrole, baseroletype, rolename, rolevitality, id: beastid, roleid, patreon, canplayerview, caution, roleattack, roledefense, rolepanic, rolestress, rolecaution, rolehash, basefatigue, basesocialsecondary, socialsecondary, size, rolesize } = result[0]
      let beast = { name, sp_atk, sp_def, vitality, panic, stress, hash, patreon, caution, roleattack, roledefense, size, basefatigue }
      let isARole = rolehash === req.params.hash

      beast.name = formatNameWithCommas(beast.name)
      if (!isARole) {
        beast.name = displayName(beast.name, baseroletype, basesecondaryrole, baseskillrole, basesocialrole, basesocialsecondary)
        beast.role = baseroletype
        beast.secondaryrole = basesecondaryrole
      }

      if (isARole) {
        if (rolename && rolename.toUpperCase() !== "NONE") {
          beast.name = beast.name + " " + rolename
        }
        if (roletype) {
          beast.name = displayName(beast.name, roletype, secondaryroletype, socialrole, skillrole, socialsecondary)
        }
        if (rolevitality) {
          beast.vitality = rolevitality
        }
        if (rolepanic) {
          beast.panic = rolepanic
        }
        if (rolestress) {
          beast.stress = rolestress
        }
        if (rolecaution) {
          beast.caution = rolecaution
        }
        if (roletype) {
          beast.role = roletype
          beast.secondaryrole = secondaryroletype
        }

        if (rolesize) {
          beast.size = rolesize
        }
      }

      let promiseArray = []
        , patreonTestValue = -1;

      let beastPatreon = beast.patreon === 0 ? beast.patreon + 3 : beast.patreon

      if (canplayerview) {
        patreonTestValue = 1000
      } else if (req.user) {
        if (req.user.id === 1 || req.user.id === 21) {
          patreonTestValue = 1000
        } else if (req.user && req.user.patreon) {
          patreonTestValue = req.user.patreon
        }
      }

      if (beastPatreon >= patreonTestValue) {
        res.send({ color: 'red', message: 'You need to update your Patreon tier to access this monster' })
      } else {
        promiseArray.push(db.get.beastmovement(beastid).then(result => {
          if (isARole) {
            beast.movement = result.filter(movementType => movementType.roleid === roleid)
            if (beast.movement.length === 0) {
              beast.movement = result.filter(movementType => !movementType.roleid)
            }
          } else {
            beast.movement = result
          }
          return result
        }))

        promiseArray.push(db.get.beastcombat(beastid).then(result => {
          if (isARole) {
            beast.combat = result.filter(weapon => weapon.roleid === roleid)
            if (beast.combat.length === 0) {
              beast.combat = result.filter(weapon => !weapon.roleid)
            }
          } else {
            beast.combat = result.filter(weapon => !weapon.roleid)
          }
          let specialAbilities = []
          beast.combat = beast.combat.map(weapon => {
            let newWeaponInfo = {
              newDR: {}, newShieldDr: {}, newDR: {}
            }
            newWeaponInfo.newDR = processDR(weapon.dr, weapon.flat, weapon.slash)
            newWeaponInfo.newShieldDr = processDR(weapon.shield_dr, weapon.shieldflat, weapon.shieldslash)
            newWeaponInfo.newDamage = processDamage(weapon.damage, weapon.isspecial, weapon.hasspecialanddamage)

            let equipmentInfo = {}
            if (weapon.selectedweapon) {
              equipmentInfo.weaponInfo = equipmentCtrl.getWeapon(weapon.selectedweapon)
            }
            if (weapon.selectedarmor) {
              equipmentInfo.armorInfo = equipmentCtrl.getArmor(weapon.selectedarmor)
            }
            if (weapon.selectedshield) {
              equipmentInfo.shieldInfo = equipmentCtrl.getShield(weapon.selectedshield)
            }

            weapon.parry = weapon.showmaxparry ? 'EUA' : weapon.parry

            if (equipmentInfo.weaponInfo && equipmentInfo.weaponInfo.bonusLong && (!weapon.weapon || weapon.weapon.includes(equipmentInfo.weaponInfo.name))) {
              specialAbilities.push(equipmentInfo.weaponInfo.bonusLong)
            }
            if (equipmentInfo.shieldInfo && equipmentInfo.shieldInfo.bonusLong && (!weapon.weapon || weapon.weapon.includes(equipmentInfo.shieldInfo.name))) {
              specialAbilities.push(equipmentInfo.shieldInfo.bonusLong)
            }

            return { ...weapon, ...newWeaponInfo, ...equipmentInfo }
          })
          beast.specialAbilities = specialAbilities
          return result
        }))

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
          finalPromise = [];
          beast.combat.forEach(val => {
            if (val.weapontype === 'r') {
              finalPromise.push(db.get.combatranges(val.id).then(ranges => {
                if (ranges.length > 0) {
                  val.ranges = ranges[0]
                } else {
                  val.ranges = { increment: 0 }
                }
                return ranges
              }))
            }
          })
          Promise.all(finalPromise).then(actualFinal => {
            res.send(beast)
          })
        })
      }
    })
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
        res.send({ color: 'red', message: 'You need to update your Patreon tier to access this monster' })
      } else {
        beast.lairloot = {};

        promiseArray.push(db.get.beasttypes(id).then(result => {
          beast.types = result
          return result
        }))

        promiseArray.push(db.get.beastenviron(id).then(result => {
          beast.environ = result
          return result
        }))

        promiseArray.push(db.get.beastcombat(id).then(result => {
          let specialAbilities = {}
          beast.combat = result.map(weapon => {
            let newWeaponInfo = {
              newDR: {}, newShieldDr: {}, newDR: {}, showEquipmentSelection: false
            }
            newWeaponInfo.newDR = processDR(weapon.dr, weapon.flat, weapon.slash)
            newWeaponInfo.newShieldDr = processDR(weapon.shield_dr, weapon.shieldflat, weapon.shieldslash)
            newWeaponInfo.newDamage = processDamage(weapon.damage, weapon.isspecial, weapon.hasspecialanddamage)
            let equipmentInfo = {}
            if (weapon.selectedweapon) {
              equipmentInfo.weaponInfo = equipmentCtrl.getWeapon(weapon.selectedweapon)
            }
            if (weapon.selectedarmor) {
              equipmentInfo.armorInfo = equipmentCtrl.getArmor(weapon.selectedarmor)
            }
            if (weapon.selectedshield) {
              equipmentInfo.shieldInfo = equipmentCtrl.getShield(weapon.selectedshield)
            }
            role = 'generic'
            if (weapon.roleid) {
              role = weapon.roleid
            }

            if (equipmentInfo.weaponInfo && equipmentInfo.weaponInfo.bonusLong && (!weapon.weapon || weapon.weapon.includes(equipmentInfo.weaponInfo.name))) {
              if (!specialAbilities[role]) {
                specialAbilities[role] = []
              }
              specialAbilities[role].push(equipmentInfo.weaponInfo.bonusLong)
            }
            if (equipmentInfo.shieldInfo && equipmentInfo.shieldInfo.bonusLong && (!weapon.weapon || weapon.weapon.includes(equipmentInfo.shieldInfo.name))) {
              if (!specialAbilities[role]) {
                specialAbilities[role] = []
              }
              specialAbilities[role].push(equipmentInfo.shieldInfo.bonusLong)
            }
            return { ...weapon, ...newWeaponInfo, ...equipmentInfo }
          })
          for (const key in specialAbilities) {
            let deduped = specialAbilities[key].filter((c, index) => specialAbilities[key].indexOf(c) === index)
            specialAbilities[key] = deduped
          }
          beast.specialAbilities = specialAbilities;
          return result
        }))

        beast.artistInfo = {}
        if (req.query.edit === 'true') {
          promiseArray.push(db.get.artist(id).then(result => {
            beast.artistInfo = { ...beast.artistInfo, ...result[0] }
          }))
          promiseArray.push(db.get.allartists(id).then(result => {
            beast.artistInfo = { ...beast.artistInfo, allartists: [...result] }
          }))
        } else {
          promiseArray.push(db.get.artist(id).then(result => {
            beast.artistInfo = { ...beast.artistInfo, ...result[0] }
          }))
        }

        if (req.query.edit === 'true') {
          promiseArray.push(db.get.beastconflictedit(id).then(result => {
            beast.conflict = { descriptions: [], convictions: [], devotions: [], flaws: [] }
            result.forEach(val => {
              if (val.type === 't' || val.type === 'c' || !val.type) {
                beast.conflict.convictions.push(val)
              } else if (val.type === 'd') {
                beast.conflict.devotions.push(val)
              } else if (val.type === 'f') {
                beast.conflict.flaws.push(val)
              } else if (val.type === 'h') {
                beast.conflict.descriptions.push(val)
              }
            })
            return result
          }))
        } else {
          promiseArray.push(db.get.beastconflict(id).then(result => {
            beast.conflict = { descriptions: [], convictions: [], devotions: [], flaws: [] }
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
              } else if (val.type === 'h') {
                beast.conflict.descriptions.push(val)
              }
            })

            beast.conflict.descriptions = beast.conflict.descriptions.sort((a, b) => +b.value - +a.value)
            beast.conflict.convictions = beast.conflict.convictions.sort((a, b) => +b.value - +a.value)
            beast.conflict.devotions = beast.conflict.devotions.sort((a, b) => +b.value - +a.value)
            beast.conflict.flaws = beast.conflict.flaws.sort(sortOutAnyToTheBottom)
            return result
          }))
        }

        promiseArray.push(db.get.beastskill(id).then(result => {
          beast.skills = result.sort((a, b) => +b.rank - +a.rank)
          return result
        }))

        if (req.user && req.user.id) {
          promiseArray.push(db.get.favorite(req.user.id, id).then(result => {
            if (result.length > 0) {
              beast.favorite = true
            } else {
              beast.favorite = false
            }
          }))
        } else {
          beast.favorite = false
        }

        promiseArray.push(db.get.beastmovement(id).then(result => {
          beast.movement = result
          return result
        }))

        if (req.user) {
          promiseArray.push(db.get.beastnotes(id, req.user.id).then(result => {
            beast.notes = result[0] || {}
            return result
          }))
        }

        promiseArray.push(db.get.beastvariants(id).then(result => {
          beast.variants = result
          return result
        }))

        promiseArray.push(db.get.beastloot(id).then(result => {
          beast.loot = result
          return result
        }))

        promiseArray.push(db.get.beastreagents(id).then(result => {
          beast.reagents = result
          return result
        }))

        promiseArray.push(db.get.locationalvitality(id).then(result => {
          beast.locationalvitality = result
          return result
        }))

        promiseArray.push(db.get['loot\\lair'].basic(id).then(result => {
          beast.lairloot = { ...result[0], ...beast.lairloot }
          return result
        }))

        promiseArray.push(db.get['loot\\lair'].alms(id).then(result => {
          beast.lairloot = { alms: result, ...beast.lairloot }
          return result
        }))

        promiseArray.push(db.get['loot\\lair'].equipment(id).then(result => {
          beast.lairloot = { equipment: result, ...beast.lairloot }
          return result
        }))

        promiseArray.push(db.get['loot\\lair'].scrolls(id).then(result => {
          beast.lairloot = { scrolls: result, ...beast.lairloot }
          return result
        }))

        promiseArray.push(db.get['loot\\lair'].traited(id).then(result => {
          beast.lairloot = { traited: result, ...beast.lairloot }
          return result
        }))

        promiseArray.push(db.get['loot\\carried'].basic(id).then(result => {
          beast.carriedloot = { ...result[0], ...beast.carriedloot }
          return result
        }))

        promiseArray.push(db.get['loot\\carried'].alms(id).then(result => {
          beast.carriedloot = { alms: result, ...beast.carriedloot }
          return result
        }))

        promiseArray.push(db.get['loot\\carried'].equipment(id).then(result => {
          beast.carriedloot = { equipment: result, ...beast.carriedloot }
          return result
        }))

        promiseArray.push(db.get['loot\\carried'].scrolls(id).then(result => {
          beast.carriedloot = { scrolls: result, ...beast.carriedloot }
          return result
        }))

        promiseArray.push(db.get['loot\\carried'].traited(id).then(result => {
          beast.carriedloot = { traited: result, ...beast.carriedloot }
          return result
        }))

        promiseArray.push(db.get.ranks(id).then(result => {
          beast.ranks = result
          return result
        }))


        promiseArray.push(db.get.beastroles(id).then(result => {
          beast.roles = result
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
              panic: result[i].panic,
              stress: result[i].stress,
              caution: result[i].caution,
              socialrole: result[i].socialrole,
              socialpoints: result[i].socialpoints,
              skillrole: result[i].skillrole,
              skillpoints: result[i].skillpoints,
              socialsecondary: result[i].socialsecondary,
              size: result[i].size,
              fatigue: result[i].fatigue
            }
          }
          return result
        }))

        promiseArray.push(db.get.casting(id).then(result => {
          beast.casting = result[0]
        }))

        promiseArray.push(db.get.spells(id).then(result => {
          beast.spells = result
        }))

        promiseArray.push(db.get.challenges(id).then(result => {
          beast.challenges = result
        }))

        if (req.query.edit === 'true') {
          promiseArray.push(db.get.obstacles_edit(id).then(result => {
            beast.obstacles = result
          }))
        } else {
          promiseArray.push(db.get.obstacles_view(id).then(result => {
            beast.obstacles = result
          }))
        }

        Promise.all(promiseArray).then(finalArray => {
          finalPromise = [];
          beast.combat.forEach(val => {
            if (val.weapontype === 'r') {
              finalPromise.push(db.get.combatranges(val.id).then(ranges => {
                if (ranges.length > 0) {
                  val.ranges = ranges[0]
                } else {
                  val.ranges = { increment: 0 }
                }
                return ranges
              }))
            }
          })
          Promise.all(finalPromise).then(actualFinal => {
            res.send(beast)
          })
        })
      }
    })
  },
}

function processDR(drString, flat, slash) {
  let newDR = {
    flat,
    slash
  }
  if (newDR.flat !== null || newDR.slash !== null) {
    return newDR
  }

  if (drString) {
    drString.split('+').forEach(element => {
      if (element.includes('/d')) {
        newDR.slash = +element.split('/d')[0]
      } else {
        newDR.flat = +element
      }
    })
  }

  return newDR
}

function processDamage(damageString, isSpecial, hasSpecialAndDamage) {
  let newDamage = {
    dice: [],
    flat: 0,
    isSpecial,
    hasSpecialAndDamage
  }

  damageString = damageString ? damageString : ''

  if (damageString.includes('see') && !isSpecial) {
    newDamage.isSpecial = true
    return newDamage
  }

  if (damageString.includes('*')) {
    damageString = damageString.replace(/\*/g, '')
    newDamage.hasSpecialAndDamage = true
  }

  let expressionValue = ""
  damageString.replace(/\s/g, '').split('').forEach((val, i, array) => {

    if (i === array.length - 1) {
      expressionValue = expressionValue + val
    }
    if (val === '-' || val === '+' || val === '*' || i === array.length - 1) {
      if (expressionValue.includes('d')) {
        newDamage.dice.push(expressionValue)
      } else {
        newDamage.flat += +expressionValue
      }
      expressionValue = ""
    } else {
      expressionValue = expressionValue + val;
    }
  })

  return newDamage
}