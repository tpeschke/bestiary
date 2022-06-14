const equipmentCtrl = require('./equipmentController')

function displayName(name, combatrole, secondarycombat, socialrole, skillrole) {
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
      nameString += `(${secondarycombat})`
    }
  }
  if (socialrole) {
    if (nameString.length > name.length + 3) {
      nameString += '/'
    }
    nameString += `${socialrole}`
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
      let { name, sp_atk, sp_def, vitality, panic, stress, roletype, baseskillrole, basesocialrole, secondaryroletype, skillrole, socialrole, basesecondaryrole, baseroletype, rolename, rolevitality, id: beastid, roleid, patreon, canplayerview, caution, roleattack, roledefense, rolepanic, rolestress, rolecaution } = result[0]
      let beast = { name, sp_atk, sp_def, vitality, panic, stress, hash, patreon, caution, roleattack, roledefense }
      let isARole = result[0].roleid && result.length <= 1

      if (baseroletype) {
        beast.name = displayName(beast.name, baseroletype, basesecondaryrole, basesocialrole, baseskillrole)
        beast.role = baseroletype
      }

      if (isARole) {
        if (rolename && rolename.toUpperCase() !== "NONE") {
          beast.name = name + " " + rolename
        }
        if (roletype) {
          beast.name = displayName(beast.name, roletype, secondaryroletype, socialrole, skillrole)
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
            return { ...weapon, ...newWeaponInfo, ...equipmentInfo }
          })
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
                val.ranges = ranges[0]
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
          beast.combat = result.map(weapon => {
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
            return { ...weapon, ...newWeaponInfo, ...equipmentInfo }
          })
          return result
        }))

        if (req.query.edit === 'true') {
          promiseArray.push(db.get.beastconflictedit(id).then(result => {
            beast.conflict = { traits: [], devotions: [], flaws: [], passions: [] }
            result.forEach(val => {
              if (val.type === 't' || !val.type) {
                beast.conflict.traits.push(val)
              } else if (val.type === 'd') {
                beast.conflict.devotions.push(val)
              } else if (val.type === 'f') {
                beast.conflict.flaws.push(val)
              } else if (val.type === 'p') {
                beast.conflict.passions.push(val)
              }
            })
            return result
          }))
        } else {
          promiseArray.push(db.get.beastconflict(id).then(result => {
            beast.conflict = { traits: [], devotions: [], flaws: [], passions: [] }
            result.forEach(val => {
              if (val.type === 't' || !val.type) {
                if (beast.traitlimit && beast.conflict.traits.length <= beast.traitlimit) {
                  beast.conflict.traits.push(val)
                } else if (!beast.traitlimit) {
                  beast.conflict.traits.push(val)
                }
              } else if (val.type === 'd') {
                beast.conflict.devotions.push(val)
              } else if (val.type === 'f') {
                beast.conflict.flaws.push(val)
              } else if (val.type === 'p') {
                beast.conflict.passions.push(val)
              }
            })
            return result
          }))
        }

        promiseArray.push(db.get.beastskill(id).then(result => {
          beast.skills = result
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

        promiseArray.push(db.get.loot.basic(id).then(result => {
          beast.lairloot = { ...result[0], ...beast.lairloot }
          return result
        }))

        promiseArray.push(db.get.loot.alms(id).then(result => {
          beast.lairloot = { alms: result, ...beast.lairloot }
          return result
        }))

        promiseArray.push(db.get.loot.equipment(id).then(result => {
          beast.lairloot = { equipment: result, ...beast.lairloot }
          return result
        }))

        promiseArray.push(db.get.loot.scrolls(id).then(result => {
          beast.lairloot = { scrolls: result, ...beast.lairloot }
          return result
        }))

        promiseArray.push(db.get.loot.traited(id).then(result => {
          beast.lairloot = { traited: result, ...beast.lairloot }
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

        Promise.all(promiseArray).then(finalArray => {
          finalPromise = [];
          beast.combat.forEach(val => {
            if (val.weapontype === 'r') {
              finalPromise.push(db.get.combatranges(val.id).then(ranges => {
                if (ranges.length > 0) {
                  val.ranges = ranges[0]
                } else {
                  val.ranges = {increment : 0}
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

  if (damageString.includes('see') && !isSpecial) {
    newDamage.isSpecial = true
    return newDamage
  }
  if (damageString.includes('*') && !hasSpecialAndDamage) {
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