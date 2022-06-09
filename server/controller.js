const roles = require('./roles')
  , equipmentCtrl = require('./equipmentController')

let rollDice = function (diceString) {
  if (typeof (diceString) === 'number') {
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
        if (expressionValue === "") {
          expressionValue = "1"
        }
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


function displayName(name, combatrole, secondarycombat, socialrole, skillrole) {
  let nameString = ''
  let roles = false

  if (name) {
    nameString += name
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
          finalArray.push(db.get.rolesforcatelog(beast.id).then(result => {
            beast.roles = result
            return result
          }))

        })

        Promise.all(finalArray).then(_ => {
          this.collectCache(app, ++index)
        })
      })
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
      if (req.user && req.user.id) {
        res.send({ canView: req.user.id === 1 || req.user.patreon >= 3 || result[0].canplayerview })
      } else {
        res.send({ canView: false })
      }
    }).catch(e => console.log(e))
  },
  getFromBestiary(req, res) {
    const db = req.app.get('db')
    db.get.beast_by_hash(req.params.hash).then(result => {
      let { name, vitality, panic, stressthreshold, roletype, baseroletype, rolename, rolevitality, id: beastid, roleid, caution, rolepanic, rolestressthreshold, rolecaution, mainhash, rolehash } = result[0]

      let beast = { name, vitality, panic, stressthreshold, hash: req.params.hash, caution, beastid, roleid, combat: [] }
      let isARole = rolehash === req.params.hash
      let roleToUse = ''

      if (baseroletype) {
        roleToUse = baseroletype
        beast.name = name + ` [${roleToUse}]`
        beast.role = baseroletype
      }

      if (isARole) {
        roleToUse = roletype
        if (rolename && rolename.toUpperCase() !== "NONE") {
          beast.name = name + " " + rolename
        }
        if (roletype) {
          beast.name = beast.name + ` [${roletype}]`
        }
        if (rolevitality) {
          beast.vitality = rolevitality
        }
        if (rolepanic) {
          beast.panic = rolepanic
        }
        if (rolestressthreshold) {
          beast.stressthreshold = rolestressthreshold
        }
        if (rolecaution) {
          beast.caution = rolecaution
        }
        if (roletype) {
          beast.role = roletype
        }
      }

      let finalPromise = [];
      finalPromise.push(db.get.beastcombat(beastid).then(result => {
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
          weapon.weapon = displayName(weapon)

          !weapon.fatigue ? weapon.fatigue = 'C' : null

          let baseSpd = 0
          let baseParry = 0
          let baseMeasure = 0
          if (roleToUse) {
            let roleInfo = roles.combatRoles.primary[roleToUse]

            if (weapon.weapontype === 'm') {
              weapon.atk += roleInfo.atk
            } else {
              weapon.atk += roleInfo.rangedAtk
            }

            weapon.def = roleInfo.def + +weapon.def 
            weapon.parry += roleInfo.parry
            weapon.init += roleInfo.init
            
            baseMeasure = roleInfo.measure
            baseSpd = roleInfo.spd
          }

          newWeaponInfo.dr = processDR(weapon.dr, weapon.flat, weapon.slash, 'armor', roleToUse, weapon.selectedarmor)
          newWeaponInfo.shield_dr = processDR(weapon.shield_dr, weapon.shieldflat, weapon.shieldslash, 'shield', roleToUse, weapon.selectedshield)

          weapon.damage = processDamage(weapon.damage, weapon.isspecial, weapon.hasspecialanddamage)
          newWeaponInfo.damage = displayDamage(weapon, roleToUse)

          if (weapon.selectedweapon) {
            weaponObj = equipmentCtrl.getWeapon(weapon.selectedweapon)

            baseSpd = weaponObj.rec
            baseParry = weaponObj.parry

            baseMeasure = weaponObj.measure
          }

          weapon.spd += baseSpd
          weapon.measure += baseMeasure

          if (weapon.selectedarmor) {
            armorObj = equipmentCtrl.getArmor(weapon.selectedarmor)

            weapon.def += armorObj.def
            weapon.init += armorObj.init
            weapon.spd += armorObj.rec
          }

          if (weapon.selectedshield) {
            shieldObj = equipmentCtrl.getShield(weapon.selectedshield)
          
            baseParry = shieldObj.parry

            weapon.def += shieldObj.def
          }

          weapon.parry += baseParry

          return { ...weapon, ...newWeaponInfo }
        })
        return result
      }))
      Promise.all(finalPromise).then(actualFinal => {
        if (beast.name) {
          res.send(beast)
        } else {
          res.send({ message: "This hash doesn't belong to a valid monster", color: 'red' })
        }
      })
    })
  },
  getPlayerBeast(req, res) {
    const db = req.app.get('db')
      , id = +req.params.id
    db.get.playerVersion(id).then(result => {
      if (req.user) {
        db.get.beastnotes(id, req.user.id).then(notes => {
          result = result[0]
          result.notes = notes[0] || {}
          res.send(result)
        })
      } else {
        res.send(result)
      }
    })
  },
  addPlayerNotes(req, res) {
    const db = req.app.get('db')
      , { beastId, noteId, notes } = req.body

    if (req.user) {
      if (noteId) {
        db.update.beastnotes(noteId, notes).then(result => {
          res.send(result[0])
        })
      } else {
        db.get.usernotecount(req.user.id).then(count => {
          count = count[0]
          if (count >= 50 || count >= (req.user.patreon * 10) + 50) {
            res.status(401).send('You need to upgrade your Patreon to add more notes')
          } else {
            db.add.beastnotes(beastId, req.user.id, notes).then(result => {
              res.send(result[0])
            })
          }
        })
      }
    } else {
      res.sendStatus(401)
    }
  },
  addBeast({ body, app }, res) {
    const db = app.get('db')
    let { name, hr, intro, habitat, ecology, number_min, number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, subsystem, patreon, vitality, panic, stress, types, environ, combat, movement, conflict, skills, int, variants, loot, reagents, lootnotes, traitlimit, devotionlimit, flawlimit, passionlimit, encounter, plural, thumbnail, rarity, locationalvitality, lairloot, roles, casting, spells, deletedSpellList, challenges, caution, role, combatpoints } = body

    db.add.beast(name, hr, intro, habitat, ecology, +number_min, +number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, +subsystem, +patreon, vitality, +panic, +stress, +int, controllerObj.createHash(), lootnotes, +traitlimit > 0 ? +traitlimit : null, +devotionlimit > 0 ? +devotionlimit : null, +flawlimit > 0 ? +flawlimit : null, +passionlimit > 0 ? +passionlimit : null, plural, thumbnail, rarity, caution, role, combatpoints).then(result => {
      let id = result[0].id
        , promiseArray = []

      roles.forEach(({ id: roleid, vitality, hash, name, role, attack, defense, secondaryrole, combatpoints, stress, panic, caution }) => {
        if (!hash) {
          hash = controllerObj.createHash()
        }
        promiseArray.push(db.add.beastroles(roleid, id, vitality, hash, name, role, attack, defense, secondaryrole, combatpoints, stress, panic, caution))
      })
      types.forEach(val => {
        promiseArray.push(db.add.beasttype(id, val.typeid).then())
      })
      environ.forEach(val => {
        promiseArray.push(db.add.beastenviron(id, val.environid).then())
      })
      combat.forEach(({ spd, atk, init, def, dr, shield_dr, measure, damage, parry, fatigue, weapon, weapontype, ranges, roleid, newDamage, selectedweapon, selectedarmor, selectedshield }) => {
        promiseArray.push(db.add.beastcombat(id, spd, atk, init, def, dr, shield_dr, measure, damage, parry, fatigue, weapon, weapontype, roleid, newDamage.isSpecial, newDamage.hasSpecialAndDamage, selectedweapon, selectedarmor, selectedshield).then(result => {
          if (weapontype === 'r') {
            return db.add.combatranges(result[0].id, +ranges.increment * 6).then()
          }
          return true;
        }))
      })
      let newConflict = []
      Object.keys(conflict).forEach(key => newConflict = [...newConflict, ...conflict[key]])
      newConflict.forEach(({ trait, value, type }) => {
        promiseArray.push(db.add.beastconflict(id, trait, value, type).then())
      })
      skills.forEach(({ skill, rank }) => {
        promiseArray.push(db.add.beastskill(id, skill, rank).then())
      })
      movement.forEach(({ stroll, walk, jog, run, sprint, type, roleid }) => {
        promiseArray.push(db.add.beastmovement(id, stroll, walk, jog, run, sprint, type, roleid).then())
      })
      variants.forEach(({ variantid }) => {
        promiseArray.push(db.add.beastvariants(id, variantid).then())
        promiseArray.push(db.add.beastvariants(variantid, id).then())
      })
      loot.forEach(({ loot, price }) => {
        promiseArray.push(db.add.beastloot(id, loot, price).then())
      })
      reagents.forEach(({ name, spell, difficulty, harvest }) => {
        promiseArray.push(db.add.beastreagents(id, name, spell, difficulty, harvest).then())
      })

      let { temperament } = encounter;
      temperament.temperament.forEach(({ temperament: temp, weight, id: tempid, beastid, tooltip, deleted, temperamentid }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.temperament(beastid, tempid))
        } else if ((temperamentid && !beastid) || (temperamentid && beastid !== id)) {
          promiseArray.push(db.add.encounter.temperament(id, temperamentid, weight))
        } else if (temperamentid && beastid) {
          promiseArray.push(db.update.encounter.temperament(weight, beastid, temperamentid))
        } else if (!temperamentid) {
          db.add.encounter.allTemp(temp, tooltip).then(result => {
            promiseArray.push(db.add.encounter.temperament(id, result[0].id, weight))
          })
        }
      })

      let { rank } = encounter;
      rank.rank.forEach(({ rank: rank, weight, id: rankid, beastid, lair, othertypechance, decayrate, deleted, number }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.rank(beastid, rankid))
        } else if ((rankid && !beastid) || (rankid && beastid !== id)) {
          promiseArray.push(db.add.encounter.rank(rankid, id, weight, othertypechance, decayrate, lair, number))
        } else if (rankid && beastid) {
          promiseArray.push(db.update.encounter.rank(rankid, id, weight, othertypechance, decayrate, lair, number))
        } else if (!rankid) {
          db.add.encounter.allRank(rank).then(result => {
            promiseArray.push(db.add.encounter.rank(result[0].id, id, weight, othertypechance, decayrate, lair, number))
          })
        }
      })

      let { verb } = encounter;
      verb.verb.forEach(({ verb, id: verbid, beastid, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.verb(beastid, verbid))
        } else if ((verbid && !beastid) || (verbid && beastid !== id)) {
          promiseArray.push(db.add.encounter.verb(verbid, id))
        } else if (!verbid) {
          db.add.encounter.allVerb(verb).then(result => {
            promiseArray.push(db.add.encounter.verb(result[0].id, id))
          })
        }
      })

      locationalvitality.forEach(({ id: locationid, location, vitality, beastid, roleid }) => {
        if (deleted) {
          promiseArray.push(db.delete.locationalvitality(beastid, locationid))
        } else if (locationid && beastid) {
          promiseArray.push(db.update.locationalvitality(beastid, location, vitality, locationid, roleid))
        } else {
          promiseArray.push(db.add.locationalvitality(beastid, locationid, vitality, roleid))
        }
      })

      let { noun } = encounter;
      noun.noun.forEach(({ noun, id: nounid, beastid, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.noun(beastid, nounid))
        } else if ((nounid && !beastid) || (nounid && beastid !== id)) {
          promiseArray.push(db.add.encounter.noun(nounid, id))
        } else if (!nounid) {
          db.add.encounter.allNoun(noun).then(result => {
            promiseArray.push(db.add.encounter.noun(result[0].id, id))
          })
        }
      })

      let { beastid, copper, silver, gold, potion, relic, enchanted, equipment, traited, scrolls, alms } = lairloot
      if (!beastid) {
        promiseArray.push(db.add.loot.basic(id, copper, silver, gold, potion, relic, enchanted))
      } else {
        promiseArray.push(db.update.loot.basic(beastid, copper, silver, gold, potion, relic, enchanted))
      }

      if (equipment) {
        equipment.forEach(({ id: equipid, beastid, value, number, deleted }) => {
          if (deleted) {
            promiseArray.push(db.delete.loot.equipment(beastid, equipid))
          } else if (equipid && beastid) {
            promiseArray.push(db.update.loot.equipment(equipid, value, number))
          } else {
            promiseArray.push(db.add.loot.equipment(id, value, number))
          }
        })
      }

      if (traited) {
        traited.forEach(({ id: traitedid, beastid, value, chancetable, deleted }) => {
          if (deleted) {
            promiseArray.push(db.delete.loot.traited(beastid, traitedid))
          } else if (traitedid && beastid) {
            promiseArray.push(db.update.loot.traited(traitedid, value, chancetable))
          } else {
            promiseArray.push(db.add.loot.traited(id, value, chancetable))
          }
        })
      }

      if (scrolls) {
        scrolls.forEach(({ id: scrollid, beastid, number, power, deleted }) => {
          if (deleted) {
            promiseArray.push(db.delete.loot.scrolls(beastid, scrollid))
          } else if (scrollid && beastid) {
            promiseArray.push(db.update.loot.scrolls(scrollid, number, power))
          } else {
            promiseArray.push(db.add.loot.scrolls(id, number, power))
          }
        })
      }

      if (alms) {
        alms.forEach(({ id: almid, beastid, number, favor, deleted }) => {
          if (deleted) {
            promiseArray.push(db.delete.loot.alms(beastid, almid))
          } else if (almid && beastid) {
            promiseArray.push(db.update.loot.alms(almid, number, favor))
          } else {
            promiseArray.push(db.add.loot.alms(id, number, favor))
          }
        })
      }

      if (casting) {
        let { augur, wild, vancian, spellnumberdie, manifesting, commanding, bloodpact } = casting
        promiseArray.push(db.update.casting(augur, wild, vancian, spellnumberdie, manifesting, commanding, bloodpact, id))
      }

      if (spells) {
        spells.forEach(({ id: spellid, name, origin, shape, range, interval, effect, beastid }) => {
          if (beastid) {
            promiseArray.push(db.update.spell(spellid, name, origin, shape, range, interval, effect, beastid))
          } else {
            promiseArray.push(db.add.spell(spellid, name, origin, shape, range, interval, effect, id))
          }
        })
      }

      if (deletedSpellList) {
        deletedSpellList.forEach(val => {
          promiseArray.push(db.delete.spell(val, id))
        })
      }

      promiseArray.push(db.delete.challenges([id, [0, ...challenges.map(challenges => challenges.id)]]).then(_ => {
        return challenges.map(({ challengesid }) => {
          if (!uniqueid) {
            return db.add.challenges(challengesid, id)
          } else {
            return true
          }
        })
      }).catch(e => console.log("beast challenges ~ ", e)))

      Promise.all(promiseArray).then(_ => {
        controllerObj.collectCache(app, 0)
        res.send({ id })
      })
    })
  },
  editBeast({ app, body }, res) {
    const db = app.get('db')
    let { id, name, hr, intro, habitat, ecology, number_min, number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, subsystem, patreon, vitality, panic, stress, types, environ, combat, movement, conflict, skills, int, variants, loot, reagents, lootnotes, traitlimit, devotionlimit, flawlimit, passionlimit, encounter, plural, thumbnail, rarity, locationalvitality, lairloot, roles, casting, spells, deletedSpellList, challenges, caution, role, combatpoints } = body
    // update beast

    db.update.beast(name, hr, intro, habitat, ecology, +number_min, +number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, subsystem ? +subsystem : null, +patreon, vitality, +panic, +stress, +int, lootnotes, +traitlimit > 0 ? +traitlimit : null, +devotionlimit > 0 ? +devotionlimit : null, +flawlimit > 0 ? +flawlimit : null, +passionlimit > 0 ? +passionlimit : null, plural, thumbnail, rarity, caution, role, combatpoints, id).then(result => {
      let promiseArray = []

      roles.forEach(({ id: roleid, vitality, hash, name, role, attack, defense, secondaryrole, combatpoints, stress, panic, caution }) => {
        if (!hash) {
          hash = controllerObj.createHash()
        }
        promiseArray.push(db.add.beastroles(roleid, id, vitality, hash, name, role, attack, defense, secondaryrole, combatpoints, stress, panic, caution).catch(e => console.log(e)))
      })
      // update types
      types.forEach(val => {
        if (!val.id) {
          promiseArray.push(db.add.beasttype(id, val.typeid).then())
        } else if (val.deleted) {
          promiseArray.push(db.delete.beasttype(val.id).then())
        }
      })
      // update environ
      environ.forEach(val => {
        if (!val.id) {
          promiseArray.push(db.add.beastenviron(id, val.environid).then())
        } else if (val.deleted) {
          promiseArray.push(db.delete.beastenviron(val.id).then())
        }
      })
      // update combat
      combat.forEach(({ spd, atk, init, def, dr, shield_dr, measure, damage, parry, fatigue, weapon, id: weaponId, deleted, weapontype, ranges, roleid, newDamage, newDR, newShieldDR, selectedweapon, selectedarmor, selectedshield }) => {
        if (deleted) {
          promiseArray.push(db.delete.beastcombat(weaponId).then())
        } else if (!weaponId) {
          promiseArray.push(db.add.beastcombat(id, spd, atk, init, def, dr, shield_dr, measure, damage, parry, fatigue, weapon, weapontype, roleid, newDamage.isSpecial, newDamage.hasSpecialAndDamage, selectedweapon, selectedarmor, selectedshield).then(result => {
            if (weapontype === 'r') {
              return db.add.combatranges(result.weaponid, +ranges.increment * 6).then()
            }
            return true;
          }))
        } else {
          promiseArray.push(db.update.beastcombat(id, spd, atk, init, def, dr, shield_dr, measure, damage, parry, fatigue, weapon, weaponId, weapontype, roleid, newDamage.isSpecial, newDamage.hasSpecialAndDamage, selectedweapon, selectedarmor, selectedshield).then())
          if (weapontype === 'r' && ranges.id) {
            promiseArray.push(db.update.combatranges(weaponId, +ranges.increment * 6).then())
          } else if (weapontype === 'r') {
            promiseArray.push(db.add.combatranges(weaponId, +ranges.increment * 6).then())
          }
        }
      })
      // update conflict
      let newConflict = []
      Object.keys(conflict).forEach(key => newConflict = [...newConflict, ...conflict[key]])
      newConflict.forEach(({ trait, value, type, id: conflictId, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.beastconflict(conflictId).then())
        } else if (!conflictId) {
          promiseArray.push(db.add.beastconflict(id, trait, value, type).then())
        } else {
          promiseArray.push(db.update.beastconflict(id, trait, value, type, conflictId).then())
        }
      })
      // update skills
      skills.forEach(({ skill, rank, id: skillId, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.beastskill(skillId).then())
        } else if (!skillId) {
          promiseArray.push(db.add.beastskill(id, skill, rank).then())
        } else {
          promiseArray.push(db.update.beastskill(id, skill, rank, skillId).then())
        }
      })
      // update movement
      movement.forEach(({ stroll, walk, jog, run, sprint, type, id: movementId, deleted, roleid }) => {
        if (deleted) {
          promiseArray.push(db.delete.beastmovement(movementId).then())
        } else if (!movementId) {
          promiseArray.push(db.add.beastmovement(id, stroll, walk, jog, run, sprint, type, roleid).then())
        } else {
          promiseArray.push(db.update.beastmovement(id, stroll, walk, jog, run, sprint, type, movementId, roleid).then())
        }
      })
      // update variants
      variants.forEach(({ id: checkId, variantid, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.beastvariants(id, variantid).then())
          promiseArray.push(db.delete.beastvariants(variantid, id).then())
        } else if (!checkId) {
          promiseArray.push(db.add.beastvariants(id, variantid).then())
          promiseArray.push(db.add.beastvariants(variantid, id).then())
        }
      })
      // update loot
      loot.forEach(({ loot, price, id: lootId, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.beastloot(lootId).then())
        } else if (!lootId) {
          promiseArray.push(db.add.beastloot(id, loot, price).then())
        } else {
          promiseArray.push(db.update.beastloot(id, loot, price, lootId).then())
        }
      })
      // update reagents
      reagents.forEach(({ name, spell, difficulty, harvest, id: reagentId, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.beastreagents(reagentId).then())
        } else if (!reagentId) {
          promiseArray.push(db.add.beastreagents(id, name, spell, difficulty, harvest).then())
        } else {
          promiseArray.push(db.update.beastreagents(id, name, spell, difficulty, harvest, reagentId).then())
        }
      })

      if (locationalvitality.length > 0) {
        locationalvitality.forEach(({ id: locationid, location, vitality, beastid, deleted, roleid }) => {
          if (deleted) {
            promiseArray.push(db.delete.locationalvitality(locationid))
          } else if (locationid && beastid) {
            promiseArray.push(db.update.locationalvitality(beastid, location, vitality, locationid, roleid))
          } else {
            promiseArray.push(db.add.locationalvitality(id, location, vitality, roleid))
          }
        })
      }

      let { temperament } = encounter;
      temperament.temperament.forEach(({ temperament: temp, weight, id: tempid, beastid, tooltip, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.temperament(beastid, tempid))
        } else if ((tempid && !beastid) || (tempid && beastid !== id)) {
          promiseArray.push(db.add.encounter.temperament(id, tempid, weight))
        } else if (tempid && beastid) {
          promiseArray.push(db.update.encounter.temperament(weight, beastid, tempid))
        } else if (!tempid) {
          db.add.encounter.allTemp(temp, tooltip).then(result => {
            promiseArray.push(db.add.encounter.temperament(id, result[0].id, weight))
          })
        }
      })

      let { rank } = encounter;
      rank.rank.forEach(({ rank: rank, weight, id: rankid, beastid, lair, othertypechance, decayrate, deleted, number }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.rank(beastid, rankid))
        } else if ((rankid && !beastid) || (rankid && beastid !== id)) {
          promiseArray.push(db.add.encounter.rank(rankid, id, weight, othertypechance, decayrate, lair, number))
        } else if (rankid && beastid) {
          promiseArray.push(db.update.encounter.rank(rankid, id, weight, othertypechance, decayrate, lair, number))
        } else if (!rankid) {
          db.add.encounter.allRank(rank).then(result => {
            promiseArray.push(db.add.encounter.rank(result[0].id, id, weight, othertypechance, decayrate, lair, number))
          })
        }
      })

      let { verb } = encounter;
      verb.verb.forEach(({ verb, id: verbid, beastid, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.verb(beastid, verbid))
        } else if ((verbid && !beastid) || (verbid && beastid !== id)) {
          promiseArray.push(db.add.encounter.verb(verbid, id))
        } else if (!verbid) {
          db.add.encounter.allVerb(verb).then(result => {
            promiseArray.push(db.add.encounter.verb(result[0].id, id))
          })
        }
      })

      let { noun } = encounter;
      noun.noun.forEach(({ noun, id: nounid, beastid, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.noun(beastid, nounid))
        } else if ((nounid && !beastid) || (nounid && beastid !== id)) {
          promiseArray.push(db.add.encounter.noun(nounid, id))
        } else if (!nounid) {
          db.add.encounter.allNoun(noun).then(result => {
            promiseArray.push(db.add.encounter.noun(result[0].id, id))
          })
        }
      })

      let { beastid, copper, silver, gold, potion, relic, enchanted, equipment, traited, scrolls, alms } = lairloot
      if (!beastid) {
        promiseArray.push(db.add.loot.basic(id, copper, silver, gold, potion, relic, enchanted))
      } else {
        promiseArray.push(db.update.loot.basic(beastid, copper, silver, gold, potion, relic, enchanted))
      }

      equipment.forEach(({ id: equipid, beastid, value, number, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.loot.equipment(beastid, equipid))
        } else if (equipid && beastid) {
          promiseArray.push(db.update.loot.equipment(equipid, value, number))
        } else {
          promiseArray.push(db.add.loot.equipment(id, value, number))
        }
      })

      traited.forEach(({ id: traitedid, beastid, value, chancetable, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.loot.traited(beastid, traitedid))
        } else if (traitedid && beastid) {
          promiseArray.push(db.update.loot.traited(traitedid, value, chancetable))
        } else {
          promiseArray.push(db.add.loot.traited(id, value, chancetable))
        }
      })

      scrolls.forEach(({ id: scrollid, beastid, number, power, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.loot.scrolls(beastid, scrollid))
        } else if (scrollid && beastid) {
          promiseArray.push(db.update.loot.scrolls(scrollid, number, power))
        } else {
          promiseArray.push(db.add.loot.scrolls(id, number, power))
        }
      })

      alms.forEach(({ id: almid, beastid, number, favor, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.loot.alms(beastid, almid))
        } else if (almid && beastid) {
          promiseArray.push(db.update.loot.alms(almid, number, favor))
        } else {
          promiseArray.push(db.add.loot.alms(id, number, favor))
        }
      })

      if (casting.beastid) {
        let { augur, wild, vancian, spellnumberdie, manifesting, commanding, bloodpact } = casting
        promiseArray.push(db.update.casting(augur, wild, vancian, spellnumberdie, manifesting, commanding, bloodpact, id))
      } else {
        promiseArray.push(db.update.casting(null, null, null, 'd4', null, null, null, id))
      }
      spells.forEach(({ id: spellid, name, origin, shape, range, interval, effect, beastid }) => {
        if (beastid) {
          promiseArray.push(db.update.spell(spellid, name, origin, shape, range, interval, effect, beastid))
        } else {
          promiseArray.push(db.add.spell(spellid, name, origin, shape, range, interval, effect, id))
        }
      })
      if (deletedSpellList) {
        deletedSpellList.forEach(val => {
          promiseArray.push(db.delete.spell(val, beastid))
        })
      }

      promiseArray.push(db.delete.challenges([id, [0, ...challenges.map(challenges => challenges.id)]]).then(_ => {
        return challenges.map(({ id: uniqueid, challengeid }) => {
          if (!uniqueid) {
            return db.add.challenges(id, challengeid)
          } else {
            return true
          }
        })
      }).catch(e => console.log("beast challenges ~ ", e)))


      Promise.all(promiseArray).then(_ => {
        controllerObj.collectCache(app, 0)
        res.send({ id })
      })
    })
  },
  deleteBeast(req, res) {
    const db = req.app.get('db')
    let id = +req.params.id

    db.delete.beast(id).then(_ => {
      let promiseArray = []

      promiseArray.push(db.delete.allbeasttypes(id).then())
      promiseArray.push(db.delete.allbeastenviron(id).then())
      promiseArray.push(db.delete.allbeastcombat(id).then())
      promiseArray.push(db.delete.allbeastconflict(id).then())
      promiseArray.push(db.delete.allbeastskill(id).then())
      promiseArray.push(db.delete.allbeastloot(id).then())
      promiseArray.push(db.delete.allbeastmovement(id).then())
      promiseArray.push(db.delete.allbeastreagents(id).then())
      promiseArray.push(db.delete.encounter.allNoun(id).then())
      promiseArray.push(db.delete.encounter.allTemperament(id).then())
      promiseArray.push(db.delete.encounter.allVerb(id).then())
      promiseArray.push(db.delete.encounter.allRank(id).then())
      promiseArray.push(db.delete.alllocationalvitality(id).then())
      promiseArray.push(db.delete.loot.basic(id).then())
      promiseArray.push(db.delete.loot.allequipment(id).then())
      promiseArray.push(db.delete.loot.alltraited(id).then())
      promiseArray.push(db.delete.loot.allscrolls(id).then())
      promiseArray.push(db.delete.loot.allalms(id).then())
      // promiseArray.push(db.delete.beastvariants(id, variantid).then())
      // promiseArray.push(db.delete.combatranges(id, variantid).then())

      Promise.all(promiseArray).then(_ => {
        controllerObj.collectCache(req.app, 0)
        res.send({ id })
      })
    })
  },
  addFavorite(req, res) {
    const db = req.app.get('db')
      , { beastid } = req.body
    if (req.user && req.user.id) {
      db.get.favoriteCount(req.user.id).then(result => {
        if (+result[0].count <= ((req.user.patreon * 3) + 3)) {
          db.add.favorite(req.user.id, beastid).then(_ => res.send({ color: "green", message: `Monster Favorited` }))
        } else {
          res.send({ color: "yellow", message: "You have too many favorited monsters: delete some or upgrade your Patreon tier" })
        }
      })
    } else {
      res.send({ color: "red", message: "You Need to Log On to Favorite Monsters" })
    }
  },
  deleteFavorite(req, res) {
    const db = req.app.get('db')
      , { beastid } = req.params
    if (req.user && req.user.id) {
      db.delete.favorite(req.user.id, beastid).then(_ => res.send({ color: "green", message: 'Monster Unfavorited' }))
    } else {
      res.send({ color: "red", message: "You Need to Log On to Unfavorite Monsters" })
    }
  },
  getUsersFavorites(req, res) {
    const db = req.app.get('db')
    if (req.user && req.user.id) {
      db.get.favorites(req.user.id).then(result => res.send(result))
    } else {
      res.send({ color: "red", message: "You Need to Log On to Favorite Monsters" })
    }
  },
  getEditEncounter(req, res) {
    const db = req.app.get('db')
    let promiseArray = []
      , encounterObject = {
        temperament: {},
        rank: {},
        verb: {},
        noun: {}
      }
      , beastid = +req.params.beastid

    promiseArray.push(db.get.encounter.temperament(beastid).then(result => {
      encounterObject.temperament.temperament = result
      return result
    }))
    promiseArray.push(db.get.encounter.allTemp(beastid).then(result => {
      encounterObject.temperament.allTemp = result
      return result
    }))

    promiseArray.push(db.get.encounter.allRank(beastid).then(result => {
      encounterObject.rank.allRank = result
      return result
    }))
    promiseArray.push(db.get.encounter.rank(beastid).then(result => {
      encounterObject.rank.rank = result
      return result
    }))

    promiseArray.push(db.get.encounter.verb(beastid).then(result => {
      encounterObject.verb.verb = result
      return result
    }))
    promiseArray.push(db.get.encounter.allVerb(beastid).then(result => {
      encounterObject.verb.allVerb = result
      return result
    }))

    promiseArray.push(db.get.encounter.noun(beastid).then(result => {
      encounterObject.noun.noun = result
      return result
    }))
    promiseArray.push(db.get.encounter.allNoun(beastid).then(result => {
      encounterObject.noun.allNoun = result
      return result
    }))

    Promise.all(promiseArray).then(_ => {
      res.send(encounterObject)
    })
  },
  getRandomEncounter(req, res) {
    const db = req.app.get('db')
    let promiseArray = []
      , encounterObject = {}
      , beastId = +req.params.beastid

    promiseArray.push(db.get.encounter.tempWeighted(beastId).then(result => {
      encounterObject.temperament = result[0]
      return result
    }))

    promiseArray.push(db.get.encounter.verbWeighted(beastId).then(result => {
      if (result[0]) {
        encounterObject.verb = result[0].verb
      }
      return result
    }))

    promiseArray.push(db.get.encounter.nounWeighted(beastId).then(result => {
      if (result[0]) {
        encounterObject.noun = result[0].noun
      }
      return result
    }))

    promiseArray.push(db.get.encounter.battlefield(beastId).then(result => {
      if (result[0]) {
        encounterObject.battlefield = result[0].battlefield
      }
      return result
    }))

    promiseArray.push(db.get.encounter.rankWeighted(beastId).then(result => {
      let mainPlayers = result
        , underlingNumber = 0
        , otherPlayers = []

      if (mainPlayers[0]) {
        while (mainPlayers[0].othertypechance > 0) {
          let percentRoll = Math.floor(Math.random() * 100) + 1
          if (percentRoll <= mainPlayers[0].othertypechance) { ++underlingNumber }
          mainPlayers[0].othertypechance -= mainPlayers[0].decayrate;
        }

        for (let i = 0; i < underlingNumber; i++) {
          randomNumber = Math.floor(Math.random() * 31) + 1
          if (randomNumber > 30) {
            otherPlayers.push(db.get.otherplayers.any(beastId).then(result => result[0]))
          } else if (randomNumber > 25) {
            otherPlayers.push(db.get.otherplayers.type(beastId).then(result => result[0]))
          } else {
            otherPlayers.push(db.get.otherplayers.exact(beastId, mainPlayers[0].rankid).then(result => {
              if (result[0]) {
                mainPlayers.push(result[0])
                return false
              } else {
                return db.get.otherplayers.type(beastId).then(result => result[0])
              }
            }))
          }
        }

        return Promise.all(otherPlayers).then(finalOtherPlayers => {
          let beastRank = {}
          beastRank.mainPlayers = mainPlayers
          beastRank.otherPlayers = finalOtherPlayers.filter(person => person).map(person => {
            if (person.name.includes(',')) {
              let splitname = person.name.split(', ')
              person.name = `${splitname[1]} ${splitname[0]}`
            }
            return person
          })
          beastRank.lair = beastRank.mainPlayers[0].lair
          encounterObject.rank = beastRank
          return beastRank
        })
      } else {
        return []
      }
    }))

    let randomEncounter = Math.floor(Math.random() * 10) > 5
    if (randomEncounter) {
      promiseArray.push(collectComplication(db, beastId).then(result => {
        let flatArray = []
        if (result.length) {
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
      }))
    }

    Promise.all(promiseArray).then(_ => {
      res.send(encounterObject)
    })
  }
}

async function collectComplication(db, beastId) {
  return db.get.complication.complication().then(result => {
    let complication = result[0]

    if (complication.id === 1) {
      //rival
      return db.get.complication.rival(beastId).then(result => {
        let rival = result[0]
        if (rival.name.includes(',')) {
          let splitname = rival.name.split(', ')
          rival.name = `${splitname[1]} ${splitname[0]}`
        }
        if (!rival.plural) {
          rival.plural = rival.name += 's'
        }

        return {
          id: 1,
          type: 'Rival',
          rival: rival
        }
      })
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
      })
    } else if (complication.id === 5) {
      //lost
      return { id: 5, type: 'Lost', distance: '10d10' }
    } else if (complication.id === 8) {
      //Back up coming
      return db.get.complication.backup(beastId).then(result => {
        let backup = result[0]
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
      })
    } else if (complication.id >= 12) {
      //roll an additional time
      let promiseArray = []
      promiseArray.push(collectComplication(db, beastId).then(result => {
        return result
      }))
      promiseArray.push(collectComplication(db, beastId).then(result => {
        return result
      }))
      return Promise.all(promiseArray).then(result => {
        let flatArray = []
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
      })
    } else {
      return complication
    }
  })
}

function processDR(drString, flat, slash, type, roleToUse, gear) {
  let role = roles.combatRoles.primary[roleToUse]
  if (roleToUse) {
    if (type === 'armor') {
      flat += role.dr.flat
      slash += role.dr.slash
    } else if (type === 'shield') {
      flat += role.shield_dr.flat
      slash += role.shield_dr.slash
    }
  }

  if (gear) {
    let gearToUse;
    if (type === 'armor') {
      gearToUse = equipmentCtrl.getArmor(gear)
    } else {
      gearToUse = equipmentCtrl.getShield(gear)
    }
    flat += gearToUse.dr.flat
    slash += gearToUse.dr.slash
  }

  if (flat && slash) {
    return `${slash}/d ${flat >= 0 ? '+' : ''}${flat}`
  } else if (flat && !slash) {
    return `${flat}`
  } else if (!flat && slash) {
    return `${slash}/d`
  }

  let newDRslash, newDRflat
  if (drString) {
    drString.split('+').forEach(element => {
      if (element.includes('/d')) {
        newDRslash = +element.split('/d')[0]
      } else {
        newDRflat = +element
      }
    })
  }

  if (roleToUse) {
    if (type === 'armor') {
      newDRflat += role.dr.flat
      newDRslash += role.dr.slash
    } else if (type === 'shield') {
      newDRflat += role.shield_dr.flat
      newDRslash += role.shield_dr.slash
    }
  }

  if (gear) {
    let gearToUse;
    if (type === 'armor') {
      gearToUse = equipmentCtrl.getArmor(gear)
    } else {
      gearToUse = equipmentCtrl.getShield(gear)
    }
    newDRflat += gearToUse.dr.flat
    newDRslash += gearToUse.dr.slash
  }

  if (newDRflat && newDRslash) {
    return `${newDRslash}/d ${flat >= 0 ? '+' : ''}${newDRflat}`
  } else if (newDRflat && !newDRslash) {
    return `${newDRflat}`
  } else if (!newDRflat && newDRslash) {
    return `${newDRslash}/d`
  }
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

function displayDamage(weapon, roleToUse) {
  if (weapon.damage.isSpecial) {
    return "*See Attack Info"
  }

  let roleDamage = null
  if (!weapon.selectedweapon && roleToUse) {
    if (weapon.weapontype === 'm') {
      roleDamage = roles.combatRoles.primary[roleToUse].damage
    } else {
      roleDamage = roles.combatRoles.primary[roleToUse].rangedDamage
    }
  } else if (weapon.selectedweapon) {
    roleDamage = equipmentCtrl.getWeapon(weapon.selectedweapon).damage
  }

  let damage = weapon.damage

  let diceObject = {
    d3s: 0,
    d4s: 0,
    d6s: 0,
    d8s: 0,
    d10s: 0,
    d12s: 0,
    d20s: 0
  }

  if (roleDamage) {
    roleDamage.dice.forEach(dice => {
      let index = dice.indexOf("d")
        , substring = dice.substring(index)
      if (substring.includes('20')) {
        if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
          diceObject.d20s += +dice.substring(0, index)
        } else {
          ++diceObject.d20s
        }
      } else if (substring.includes('12')) {
        if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
          diceObject.d12s += +dice.substring(0, index)
        } else {
          ++diceObject.d12s
        }
      } else if (substring.includes('10')) {
        if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
          diceObject.d10s += +dice.substring(0, index)
        } else {
          ++diceObject.d10s
        }
      } else if (substring.includes('8')) {
        if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
          diceObject.d8s += +dice.substring(0, index)
        } else {
          ++diceObject.d8s
        }
      } else if (substring.includes('6')) {
        if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
          diceObject.d6s += +dice.substring(0, index)
        } else {
          ++diceObject.d6s
        }
      } else if (substring.includes('4')) {
        if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
          diceObject.d4s += +dice.substring(0, index)
        } else {
          ++diceObject.d4s
        }
      } else if (substring.includes('3')) {
        if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
          diceObject.d3s += +dice.substring(0, index)
        } else {
          ++diceObject.d3s
        }
      }
    })
  }

  damage.dice.forEach(dice => {
    let index = dice.indexOf("d")
      , substring = dice.substring(index)
    if (substring.includes('20')) {
      if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
        diceObject.d20s += +dice.substring(0, index)
      } else {
        ++diceObject.d20s
      }
    } else if (substring.includes('12')) {
      if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
        diceObject.d12s += +dice.substring(0, index)
      } else {
        ++diceObject.d12s
      }
    } else if (substring.includes('10')) {
      if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
        diceObject.d10s += +dice.substring(0, index)
      } else {
        ++diceObject.d10s
      }
    } else if (substring.includes('8')) {
      if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
        diceObject.d8s += +dice.substring(0, index)
      } else {
        ++diceObject.d8s
      }
    } else if (substring.includes('6')) {
      if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
        diceObject.d6s += +dice.substring(0, index)
      } else {
        ++diceObject.d6s
      }
    } else if (substring.includes('4')) {
      if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
        diceObject.d4s += +dice.substring(0, index)
      } else {
        ++diceObject.d4s
      }
    } else if (substring.includes('3')) {
      if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
        diceObject.d3s += +dice.substring(0, index)
      } else {
        ++diceObject.d3s
      }
    }
  })

  let { d3s, d4s, d6s, d8s, d10s, d12s, d20s } = diceObject

  let diceString = ''
  if (d3s > 0) {
    diceString += `${d3s}d3!`
  }
  if (d4s > 0) {
    diceString += ` ${diceString !== '' ? '+' : ''}${d4s}d4!`
  }
  if (d6s > 0) {
    diceString += ` ${diceString !== '' ? '+' : ''}${d6s}d6!`
  }
  if (d8s > 0) {
    diceString += ` ${diceString !== '' ? '+' : ''}${d8s}d8!`
  }
  if (d10s > 0) {
    diceString += ` ${diceString !== '' ? '+' : ''}${d10s}d10!`
  }
  if (d12s > 0) {
    diceString += ` ${diceString !== '' ? '+' : ''}${d12s}d12!`
  }
  if (d20s > 0) {
    diceString += ` ${diceString !== '' ? '+' : ''}${d20s}d20!`
  }

  let modifier = damage.flat
  if (roleDamage) {
    modifier = roleDamage.flat + damage.flat
  }

  if (modifier > 0) {
    diceString += ` +${modifier}`
  } else if (modifier < 0) {
    diceString += ` ${modifier}`
  }

  if (damage.hasSpecialAndDamage) {
    diceString += '*'
  }

  return diceString
}

function displayName (weapon) {
  let {selectedweapon, selectedarmor, selectedshield} = weapon

  if (selectedweapon && selectedarmor && selectedshield) {
    return `${selectedweapon}, ${selectedarmor}, & ${selectedshield}`
  } else if (selectedweapon && selectedarmor && !selectedshield) {
    return `${selectedweapon} & ${selectedarmor}`
  } else if (selectedweapon && !selectedarmor && selectedshield) {
    return `${selectedweapon} & ${selectedshield}`
  } else if (selectedweapon && !selectedarmor && !selectedshield) {
    return `${selectedweapon}`
  } else if (!selectedweapon && selectedarmor && selectedshield) {
    return `${selectedarmor}, & ${selectedshield}`
  } else if (!selectedweapon && selectedarmor && !selectedshield) {
    return `${selectedarmor}`
  } else if (!selectedweapon && !selectedarmor && selectedshield) {
    return `${selectedshield}`
  } else {
    return weapon.weapon
  }
}

module.exports = controllerObj