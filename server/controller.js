let controllerObj = {
  catalogCache: [],
  newCache: [],
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

        promiseArray.push(db.get.beastmovement(id).then(result => {
          beast.movement = result
          return result
        }))

        Promise.all(promiseArray).then(finalArray => res.send(beast))
      }
    })
  },
  addBeast({ body, app }, res) {
    const db = app.get('db')
    let { name, hr, intro, habitat, ecology, number_min, number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, subsystem, patreon, vitality, panic, broken, types, environ, combat, movement } = body

    db.add.beast(name, hr, intro, habitat, ecology, +number_min, +number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, +subsystem, +patreon, vitality, +panic, +broken).then(result => {
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
      combat.forEach(({ spd, atk, init, def, dr, shield_dr, measure, damage, parry, encumb, weapon }) => {
        promiseArray.push(db.add.beastcombat(id, spd, atk, init, def, dr, shield_dr, measure, damage, parry, encumb, weapon).then())
      })
      //movement
      movement.forEach(({ stroll, walk, jog, run, sprint, type }) => {
        promiseArray.push(db.add.beastmovement(id, stroll, walk, jog, run, sprint, type).then())
      })

      Promise.all(promiseArray).then(_ => {
        controllerObj.collectCache(app, 0)
        res.send({ id })
      })
    })
  },
  editBeast({ app, body }, res) {
    const db = app.get('db')
    let { id, name, hr, intro, habitat, ecology, number_min, number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, subsystem, patreon, vitality, panic, broken, types, environ, combat, movement, new_image } = body

    // update beast
    db.update.beast(name, hr, intro, habitat, ecology, +number_min, +number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, +subsystem, +patreon, vitality, +panic, +broken, id).then(result => {
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
      combat.forEach(({ spd, atk, init, def, dr, shield_dr, measure, damage, parry, encumb, weapon, id: weaponId, deleted }) => {
        if (!weaponId) {
          promiseArray.push(db.add.beastcombat(id, spd, atk, init, def, dr, shield_dr, measure, damage, parry, encumb, weapon).then())
        } else if (deleted) {
          promiseArray.push(db.delete.beastcombat(weaponId).then())
        } else {
          promiseArray.push(db.update.beastcombat(id, spd, atk, init, def, dr, shield_dr, measure, damage, parry, encumb, weapon, weaponId).then())
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
      promiseArray.push(db.delete.allbeastmovement(id).then())

      Promise.all(promiseArray).then(_ => {
        controllerObj.collectCache(req.app, 0)
        res.send({ id })
      })
    })
  }
}

module.exports = controllerObj