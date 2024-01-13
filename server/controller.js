const upsertHelper = require('./upsertHelper')
const catalogCtrl = require('./catalogController')

const { sendErrorForwardNoFile, checkForContentTypeBeforeSending, createHash } = require('./helpers')
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
  // BEAST ENDPOINTS
  checkIfPlayerView(req, res) {
    const db = req.app.get('db')
      , id = +req.params.id

    db.get.playercanview(id).then(result => {
      checkForContentTypeBeforeSending(res, { canView: (req.user && req.user.id === 1) || (req.user && req.user.patreon >= 3) || result[0].canplayerview })
    }).catch(e => sendErrorForward('player can view', e, res))
  },
  canEditMonster(req, res) {
    const db = req.app.get('db')
      , id = +req.params.id
    if (req.user) {
      db.get.can_edit(id).then(result => {
        if (result.length > 0) {
          checkForContentTypeBeforeSending(res, { canEdit: req.user.id === 1 || req.user.id === 21 || req.user.id === result[0].userid })
        } else {
          db.get.custom_beast_count(req.user.id).then(count => {
            const number = +count[0].count
            const canCreate = req.user.patreon >= 5 && number <= (5 + (req.user.patreon * 2))
            const canEdit = req.user.id === 1 || req.user.id === 21 || canCreate
            if (canEdit) {
              checkForContentTypeBeforeSending(res, { canEdit })
            } else {
              sendErrorForward('add custom monster', { message: "You've hit your limit for monsters. Upgrade your Patreon for more." }, res)
            }
          }).catch(e => sendErrorForward('get custom monster count', e, res))
        }
      }).catch(e => sendErrorForward('can edit custom', e, res))
    } else {
      checkForContentTypeBeforeSending(res, { canEdit: false })
    }
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
  addBeast({ body, app, user }, res) {
    const db = app.get('db')
    let { name, hr, intro, climates, habitat, ecology, number_min, number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, subsystem, patreon, vitality, panic, stress, types, movement, conflict, skills, variants, loot, reagents, lootnotes, traitlimit, devotionlimit, flawlimit, passionlimit, encounter, plural, thumbnail, rarity, locationalvitality, lairloot, roles, casting, spells, deletedSpellList, challenges, obstacles, caution, role, combatpoints, socialrole, socialpoints, secondaryrole, skillrole, skillpoints, fatigue, artistInfo, defaultrole, socialsecondary, notrauma, carriedloot, folklore, combatStatArray, knockback, singledievitality, noknockback, tables, rolenameorder, descriptionshare, convictionshare, devotionshare, rollundertrauma, imagesource } = body

    const userid = user.id === 1 || user.id === 21 ? null : user.id
    db.add.beast(userid, name, hr, intro, habitat, ecology, +number_min, +number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, +subsystem, +patreon, vitality, panic, +stress, createHash(), lootnotes, +traitlimit > 0 ? +traitlimit : null, +devotionlimit > 0 ? +devotionlimit : null, +flawlimit > 0 ? +flawlimit : null, +passionlimit > 0 ? +passionlimit : null, plural, thumbnail, rarity, caution, role, combatpoints, socialrole, socialpoints, secondaryrole, skillrole, skillpoints, fatigue, defaultrole, socialsecondary, notrauma, knockback, singledievitality, noknockback, rolenameorder, descriptionshare, convictionshare, devotionshare, rollundertrauma, imagesource).then(result => {
      let id = result[0].id
        , promiseArray = []

      upsertHelper.upsertRoles(promiseArray, db, id, res, roles)
      upsertHelper.upsertTypes(promiseArray, db, id, res, types)
      upsertHelper.upsertClimates(promiseArray, db, id, res, climates)
      upsertHelper.upsertCombats(promiseArray, db, id, res, combatStatArray)
      upsertHelper.upsertConflict(promiseArray, db, id, res, conflict)
      upsertHelper.upsertSkills(promiseArray, db, id, res, skills)
      upsertHelper.upsertMovement(promiseArray, db, id, res, movement)
      upsertHelper.upsertVariants(promiseArray, db, id, res, variants)
      upsertHelper.upsertLoot(promiseArray, db, id, res, loot)
      upsertHelper.upsertReagents(promiseArray, db, id, res, reagents)
      upsertHelper.upsertLocation(promiseArray, db, id, res, locationalvitality)
      upsertHelper.upsertArtist(promiseArray, db, id, res, artistInfo)

      let { appearance, habitat, attack, defense } = tables
      upsertHelper.deleteTables(promiseArray, db, id, res, appearance, habitat, attack, defense)
      upsertHelper.upsertApperanceTable(promiseArray, db, id, res, appearance)
      upsertHelper.upsertHabitatTable(promiseArray, db, id, res, habitat)
      upsertHelper.upsertAttackTable(promiseArray, db, id, res, attack)
      upsertHelper.upsertDefenseTable(promiseArray, db, id, res, defense)

      let { temperament, signs, rank, noun, verb, groups, numbers } = encounter;
      upsertHelper.upsertTemperament(promiseArray, db, id, res, temperament)
      upsertHelper.upsertGroups(promiseArray, db, id, res, groups)
      upsertHelper.upsertNumbers(promiseArray, db, id, res, numbers)
      upsertHelper.upsertSigns(promiseArray, db, id, res, signs)
      upsertHelper.upsertVerb(promiseArray, db, id, res, verb)
      upsertHelper.upsertNoun(promiseArray, db, id, res, noun)

      let { beastid, copper, silver, gold, potion, relic, enchanted, equipment, traited, scrolls, alms, talisman } = lairloot
      upsertHelper.upsertLairBasic(promiseArray, db, id, res, beastid, copper, silver, gold, potion, relic, enchanted, talisman)
      upsertHelper.upsertEquipmentLair(promiseArray, db, id, res, equipment)
      upsertHelper.upsertTraitedLair(promiseArray, db, id, res, traited)
      upsertHelper.upsertScrollsLair(promiseArray, db, id, res, scrolls)
      upsertHelper.upsertAlmsLair(promiseArray, db, id, res, alms)

      let { beastid: cbeastid, copper: ccopper, silver: csilver, gold: cgold, potion: cpotion, relic: crelic, enchanted: cenchanted, equipment: cequipment, traited: ctraited, scrolls: cscrolls, alms: calms, talisman: ctalisman } = carriedloot
      upsertHelper.upsertBasicCarried(promiseArray, db, id, res, cbeastid, ccopper, csilver, cgold, cpotion, crelic, cenchanted, ctalisman)
      upsertHelper.upsertEquipmentCarried(promiseArray, db, id, res, cequipment)
      upsertHelper.upsertTraitedCarried(promiseArray, db, id, res, ctraited)
      upsertHelper.upsertScrollsCarried(promiseArray, db, id, res, cscrolls)
      upsertHelper.upsertAlmsCarried(promiseArray, db, id, res, calms)

      upsertHelper.upsertCasting(promiseArray, db, id, res, casting)
      upsertHelper.deleteFromSpellList(promiseArray, db, id, res, deletedSpellList)
      upsertHelper.upsertSpells(promiseArray, db, id, res, spells)
      upsertHelper.upsertObstacles(promiseArray, db, id, res, obstacles)
      upsertHelper.upsertChallenges(promiseArray, db, id, res, challenges)
      upsertHelper.upsertFolklore(promiseArray, db, id, res, folklore)

      Promise.all(promiseArray).then(_ => {
        catalogCtrl.collectCatalog(app)
        checkForContentTypeBeforeSending(res, { id })
      }).catch(e => sendErrorForward('add beast final array', e, res))
    }).catch(e => sendErrorForward('add beast main', e, res))
  },
  editBeast({ app, body }, res) {
    const db = app.get('db')
    let { id, name, hr, intro, habitat, ecology, climates, number_min, number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, subsystem, patreon, largeweapons, panic, mental, types, movement, conflict, skills, variants, loot, reagents, lootnotes, traitlimit, devotionlimit, flawlimit, passionlimit, encounter, plural, thumbnail, rarity, locationalvitality, lairloot, roles, casting, spells, deletedSpellList, challenges, obstacles, caution, role, combatpoints, socialrole, socialpoints, secondaryrole, skillrole, skillpoints, fatigue, artistInfo, defaultrole, socialsecondary, notrauma, carriedloot, folklore, combatStatArray, knockback: mainknockback, singledievitality, noknockback, tables, rolenameorder, descriptionshare, convictionshare, devotionshare, rollundertrauma, imagesource } = body

    db.update.beast(name, hr, intro, habitat, ecology, +number_min, +number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, subsystem ? +subsystem : null, +patreon, largeweapons, panic, mental, lootnotes, +traitlimit > 0 ? +traitlimit : null, +devotionlimit > 0 ? +devotionlimit : null, +flawlimit > 0 ? +flawlimit : null, +passionlimit > 0 ? +passionlimit : null, plural, thumbnail, rarity, caution, role, combatpoints, socialrole, socialpoints, id, secondaryrole, skillrole, skillpoints, fatigue, defaultrole, socialsecondary, notrauma, mainknockback, singledievitality, noknockback, rolenameorder, descriptionshare, convictionshare, devotionshare, rollundertrauma, imagesource).then(result => {
      let promiseArray = []

      upsertHelper.upsertRoles(promiseArray, db, id, res, roles)
      upsertHelper.upsertTypes(promiseArray, db, id, res, types)
      upsertHelper.upsertClimates(promiseArray, db, id, res, climates)
      upsertHelper.upsertCombats(promiseArray, db, id, res, combatStatArray)
      upsertHelper.upsertConflict(promiseArray, db, id, res, conflict)
      upsertHelper.upsertSkills(promiseArray, db, id, res, skills)
      upsertHelper.upsertMovement(promiseArray, db, id, res, movement)
      upsertHelper.upsertVariants(promiseArray, db, id, res, variants)
      upsertHelper.upsertLoot(promiseArray, db, id, res, loot)
      upsertHelper.upsertReagents(promiseArray, db, id, res, reagents)
      upsertHelper.upsertLocation(promiseArray, db, id, res, locationalvitality)
      upsertHelper.upsertArtist(promiseArray, db, id, res, artistInfo)

      let { appearance, habitat, attack, defense } = tables
      upsertHelper.deleteTables(promiseArray, db, id, res, appearance, habitat, attack, defense)
      upsertHelper.upsertApperanceTable(promiseArray, db, id, res, appearance)
      upsertHelper.upsertHabitatTable(promiseArray, db, id, res, habitat)
      upsertHelper.upsertAttackTable(promiseArray, db, id, res, attack)
      upsertHelper.upsertDefenseTable(promiseArray, db, id, res, defense)

      let { temperament, signs, rank, noun, verb, groups, numbers } = encounter;
      upsertHelper.upsertTemperament(promiseArray, db, id, res, temperament)
      upsertHelper.upsertGroups(promiseArray, db, id, res, groups)
      upsertHelper.upsertNumbers(promiseArray, db, id, res, numbers)
      upsertHelper.upsertSigns(promiseArray, db, id, res, signs)
      upsertHelper.upsertVerb(promiseArray, db, id, res, verb)
      upsertHelper.upsertNoun(promiseArray, db, id, res, noun)

      let { beastid, copper, silver, gold, potion, relic, enchanted, equipment, traited, scrolls, alms, talisman } = lairloot
      upsertHelper.upsertLairBasic(promiseArray, db, id, res, beastid, copper, silver, gold, potion, relic, enchanted, talisman)
      upsertHelper.upsertEquipmentLair(promiseArray, db, id, res, equipment)
      upsertHelper.upsertTraitedLair(promiseArray, db, id, res, traited)
      upsertHelper.upsertScrollsLair(promiseArray, db, id, res, scrolls)
      upsertHelper.upsertAlmsLair(promiseArray, db, id, res, alms)

      let { beastid: cbeastid, copper: ccopper, silver: csilver, gold: cgold, potion: cpotion, relic: crelic, enchanted: cenchanted, equipment: cequipment, traited: ctraited, scrolls: cscrolls, alms: calms, talisman: ctalisman } = carriedloot
      upsertHelper.upsertBasicCarried(promiseArray, db, id, res, cbeastid, ccopper, csilver, cgold, cpotion, crelic, cenchanted, ctalisman)
      upsertHelper.upsertEquipmentCarried(promiseArray, db, id, res, cequipment)
      upsertHelper.upsertTraitedCarried(promiseArray, db, id, res, ctraited)
      upsertHelper.upsertScrollsCarried(promiseArray, db, id, res, cscrolls)
      upsertHelper.upsertAlmsCarried(promiseArray, db, id, res, calms)

      upsertHelper.upsertCasting(promiseArray, db, id, res, casting)
      upsertHelper.deleteFromSpellList(promiseArray, db, id, res, deletedSpellList)
      upsertHelper.upsertSpells(promiseArray, db, id, res, spells)
      upsertHelper.upsertObstacles(promiseArray, db, id, res, obstacles)
      upsertHelper.upsertChallenges(promiseArray, db, id, res, challenges)
      upsertHelper.upsertFolklore(promiseArray, db, id, res, folklore)

      Promise.all(promiseArray).then(_ => {
        catalogCtrl.collectCatalog(app)
        checkForContentTypeBeforeSending(res, { id })
      }).catch(e => sendErrorForward('update beast final promise', e, res))
    }).catch(e => sendErrorForward('update beast main', e, res))
  },
  deleteBeast(req, res) {
    const db = req.app.get('db')
    let id = +req.params.id

    db.delete.beast(id).then(_ => {
      let promiseArray = []

      promiseArray.push(db.delete.allbeasttypes(id).catch(e => sendErrorForward('delete beast types', e, res)))
      promiseArray.push(db.delete.climate.allclimates(id).catch(e => sendErrorForward('delete beast climates', e, res)))
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
        catalogCtrl.collectCatalog(req.app)
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