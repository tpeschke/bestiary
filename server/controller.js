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
        if (result.length > 0) {
          this.newCache.push(result)
        }
        this.collectCache(app, ++index)
      })
    } else {
      this.catalogCache = this.newCache
      this.newCache = []
      console.log('catalog collected')
    }
  },
  // BEAST ENDPOINTS
  checkIfPlayerView(req, res) {
    const db = req.app.get('db')
      , id = +req.params.id

      db.get.playercanview(id).then( result => {
        res.send(result[0])
      })
  },
  getSingleBeast(req, res) {
    const db = req.app.get('db')
      , id = +req.params.id

    db.get.beastmaininfo(id).then(result => {
      let beast = result[0]
        , promiseArray = []

      let patreonTestValue = 0;
      if (req.user && req.user.id === 1 || req.user.id === 21) {
        patreonTestValue = 1000
      } else if (req.user && req.user.patreon) {
        patreonTestValue = req.user.patreon
      }

      if (beast.patreon > patreonTestValue) {
        res.sendStatus(401).send('You need to update your Patreon tier to access this monster')
      } else {
        promiseArray.push(db.get.beasttypes(id).then(result => {
          beast.types = result
          return result
        }))

        promiseArray.push(db.get.beastenviron(id).then(result => {
          beast.environ = result
          return result
        }))

        promiseArray.push(db.get.beastcombat(id).then(result => {
          beast.combat = result
          return result
        }))

        promiseArray.push(db.get.beastconflict(id).then(result => {
          beast.conflict = {traits: [], devotions: [], flaws: [], passions: []}
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

        promiseArray.push(db.get.beastskill(id).then(result => {
          beast.skills = result
          return result
        }))

        promiseArray.push(db.get.beastmovement(id).then(result => {
          beast.movement = result
          return result
        }))

        promiseArray.push(db.get.beastnotes(id, req.user.id).then(result => {
          beast.notes = result[0] || {}
          return result
        }))

        promiseArray.push(db.get.beastvariants(id, req.user.patreon).then(result => {
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
          Promise.all(finalPromise).then(actualFinal => res.send(beast))
        })
      }
    })
  },
  getFromBestiary(req, res) {
    const db = req.app.get('db')

    if (req.query.patreon < 3) {
      res.sendStatus(401).send("You need to update your Patreon to gain access to this feature")
    } else {
      db.get.beast_by_hash(req.params.hash).then(beast => {
        beast = beast[0]
        let finalPromise = [];
        db.get.beastcombat(beast.id).then(result => {
          beast.combat = result
          beast.combat.forEach(val => {
            if (val.weapontype === 'r') {
              finalPromise.push(db.get.combatranges(val.id).then(ranges => {
                val.ranges = ranges[0]
                return ranges
              }))
            }
          })
          Promise.all(finalPromise).then(actualFinal => res.send(beast))
        })
      })
    }

  },
  getPlayerBeast(req, res) {
    const db = req.app.get('db')
      , id = +req.params.id

    db.get.playerVersion(id).then(result => {
      db.get.beastnotes(id, req.user.id).then(notes => {
        result = result[0]
        result.notes = notes[0] || {}
        res.send(result)
      })
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
          if (count >= 5 || count >= req.user.patreon * 10) {
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
    let { name, hr, intro, habitat, ecology, number_min, number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, subsystem, patreon, vitality, panic, broken, types, environ, combat, movement, conflict, skills, int, variants, loot, reagents, lootnotes } = body

    db.add.beast(name, hr, intro, habitat, ecology, +number_min, +number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, +subsystem, +patreon, vitality, +panic, +broken, +int, controllerObj.createHash(), lootnotes).then(result => {
      let id = result[0].id
        , promiseArray = []
      //types
      types.forEach(val => {
        promiseArray.push(db.add.beasttype(id, val.typeid).then())
      })
      //environ
      environ.forEach(val => {
        promiseArray.push(db.add.beastenviron(id, val.environid).then())
      })
      //combat
      combat.forEach(({ spd, atk, init, def, dr, shield_dr, measure, damage, parry, encumb, weapon, weapontype, ranges }) => {
        promiseArray.push(db.add.beastcombat(id, spd, atk, init, def, dr, shield_dr, measure, damage, parry, encumb, weapon, weapontype).then(result => {
          if (weapontype === 'r') {
            return db.add.combatranges(result[0].id, +ranges.zero, +ranges.two, +ranges.four, +ranges.six, +ranges.eight).then()
          } 
          return true;
        }))
      })
      //conflict
      let newConflict = []
      Object.keys(conflict).forEach(key => newConflict = [...newConflict, ...conflict[key]])
      newConflict.forEach(({ trait, value, type }) => {
        promiseArray.push(db.add.beastconflict(id, trait, value, type).then())
      })
      //skills
      skills.forEach(({ skill, rank }) => {
        promiseArray.push(db.add.beastskill(id, skill, rank).then())
      })
      //movement
      movement.forEach(({ stroll, walk, jog, run, sprint, type }) => {
        promiseArray.push(db.add.beastmovement(id, stroll, walk, jog, run, sprint, type).then())
      })
      //variants
      variants.forEach(({ variantid }) => {
        promiseArray.push(db.add.beastvariants(id, variantid).then())
        promiseArray.push(db.add.beastvariants(variantid, id).then())
      })
      //loot
      loot.forEach(({ loot, price }) => {
        promiseArray.push(db.add.beastloot(id, loot, price).then())
      })
      //reagents
      reagents.forEach(({ name, spell, difficulty }) => {
        promiseArray.push(db.add.beastreagents(id, name, spell, difficulty).then())
      })

      Promise.all(promiseArray).then(_ => {
        controllerObj.collectCache(app, 0)
        res.send({ id })
      })
    })
  },
  editBeast({ app, body }, res) {
    const db = app.get('db')
    let { id, name, hr, intro, habitat, ecology, number_min, number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, subsystem, patreon, vitality, panic, broken, types, environ, combat, movement, conflict, skills, int, variants, loot, reagents, lootnotes } = body

    // update beast
    db.update.beast(name, hr, intro, habitat, ecology, +number_min, +number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, +subsystem, +patreon, vitality, +panic, +broken, +int, lootnotes, id).then(result => {
      let promiseArray = []
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
      combat.forEach(({ spd, atk, init, def, dr, shield_dr, measure, damage, parry, encumb, weapon, id: weaponId, deleted, weapontype, ranges }) => {
        if (!weaponId) {
          promiseArray.push(db.add.beastcombat(id, spd, atk, init, def, dr, shield_dr, measure, damage, parry, encumb, weapon, weapontype).then(result => {
            if (weapontype === 'r') {
              return db.add.combatranges(result.weaponid, +ranges.zero, +ranges.two, +ranges.four, +ranges.six, +ranges.eight).then()
            } 
            return true;
          }))
        } else if (deleted) {
          promiseArray.push(db.delete.beastcombat(weaponId).then())
        } else {
          promiseArray.push(db.update.beastcombat(id, spd, atk, init, def, dr, shield_dr, measure, damage, parry, encumb, weapon, weaponId, weapontype).then())
          if (weapontype === 'r' && ranges.id) {
            promiseArray.push(db.update.combatranges(weaponId, +ranges.zero, +ranges.two, +ranges.four, +ranges.six, +ranges.eight).then())
          } else if (weapontype === 'r') {
            promiseArray.push(db.add.combatranges(weaponId, +ranges.zero, +ranges.two, +ranges.four, +ranges.six, +ranges.eight).then())
          }
        }
      })
      // update conflict
      let newConflict = []
      Object.keys(conflict).forEach(key => newConflict = [...newConflict, ...conflict[key]])
      newConflict.forEach(({ trait, value, type, id: conflictId, deleted }) => {
        if (!conflictId) {
          promiseArray.push(db.add.beastconflict(id, trait, value, type).then())
        } else if (deleted) {
          promiseArray.push(db.delete.beastconflict(conflictId).then())
        } else {
          promiseArray.push(db.update.beastconflict(id, trait, value, type, conflictId).then())
        }
      })
      // update skills
      skills.forEach(({ skill, rank, id: skillId, deleted }) => {
        if (!skillId) {
          promiseArray.push(db.add.beastskill(id, skill, rank).then())
        } else if (deleted) {
          promiseArray.push(db.delete.beastskill(skillId).then())
        } else {
          promiseArray.push(db.update.beastskill(id, skill, rank, skillId).then())
        }
      })
      // update movement
      movement.forEach(({ stroll, walk, jog, run, sprint, type, id: movementId, deleted }) => {
        if (!movementId) {
          promiseArray.push(db.add.beastmovement(id, stroll, walk, jog, run, sprint, type).then())
        } else if (deleted) {
          promiseArray.push(db.delete.beastmovement(movementId).then())
        } else {
          promiseArray.push(db.update.beastmovement(id, stroll, walk, jog, run, sprint, type, movementId).then())
        }
      })
      // update variants
      variants.forEach(({ id: checkId, variantid, deleted }) => {
        if (!checkId) {
          promiseArray.push(db.add.beastvariants(id, variantid).then())
          promiseArray.push(db.add.beastvariants(variantid, id).then())
        } else if (deleted) {
          promiseArray.push(db.delete.beastvariants(id, variantid).then())
        }
      })
      // update loot
      loot.forEach(({ loot, price, id: lootId, deleted }) => {
        if (!lootId) {
          promiseArray.push(db.add.beastloot(id, loot, price).then())
        } else if (deleted) {
          promiseArray.push(db.delete.beastloot(lootId).then())
        } else {
          promiseArray.push(db.update.beastloot(id, loot, price, lootId).then())
        }
      })
      // update reagents
      reagents.forEach(({ name, spell, difficulty, id: reagentId, deleted }) => {
        if (!reagentId) {
          promiseArray.push(db.add.beastreagents(id, name, spell, difficulty).then())
        } else if (deleted) {
          promiseArray.push(db.delete.beastreagents(reagentId).then())
        } else {
          promiseArray.push(db.update.beastreagents(id, name, spell, difficulty, reagentId).then())
        }
      })

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
      // promiseArray.push(db.delete.beastvariants(id, variantid).then())
      // promiseArray.push(db.delete.combatranges(id, variantid).then())

      Promise.all(promiseArray).then(_ => {
        controllerObj.collectCache(req.app, 0)
        res.send({ id })
      })
    })
  }
}

module.exports = controllerObj