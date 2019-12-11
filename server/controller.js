module.exports = {
  catalogCache: [],
  collectCache(app, index) {
    const db = app.get('db')
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    if (alphabet[index]) {
      db.get.catalogbyletter(alphabet[index]).then(result => {
        if (result.length > 0) {
          this.catalogCache.push(result)
        }
        this.collectCache(app, ++index)
      })
    } else {
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
        promiseArray.push(db.get.beasttypes(id).then(result => {
          let newTypeArray = []
          result.forEach(val => newTypeArray.push(val.typeid))
          beast.types = newTypeArray
          return newTypeArray
        }))

        promiseArray.push(db.get.beastenviron(id).then(result => {
          let newEnvironArray =[]
          result.forEach(val => newEnvironArray.push(val.environid))
          beast.environ = newEnvironArray
          return newEnvironArray
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
      })
  },
  addBeast({body, app}, res) {
    const db = app.get('db')
    let {name, hr, intro, habitat, ecology, number_min, number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, subsystem, patreon, vitality, panic, broken, types, environ, combat, movement} = body

    db.add.beast(name, hr, intro, habitat, ecology, +number_min, +number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, +subsystem, +patreon, vitality, +panic, +broken).then(result => {
      let id = result[0].id
      , promiseArray = []
      //types
      types.forEach(val => {
        promiseArray.push(db.add.beasttype(id, val).then())
      })
      //environ
      environ.forEach(val => {
        promiseArray.push(db.add.beastenviron(id, val).then())
      })
      //combat
      combat.forEach(({spd, atk, init, def, dr, shield_dr, measure, damage, parry, encumb, weapon}) => {
        promiseArray.push(db.add.beastcombat(id, spd, atk, init, def, dr, shield_dr, measure, damage, parry, encumb, weapon).then())
      })
      //movement
      movement.forEach(({stroll, walk, jog, run, sprint, type}) => {
        promiseArray.push(db.add.beastmovement(id, stroll, walk, jog, run, sprint, type).then())
      })

      Promise.all(promiseArray).then(_ => res.send({id}))
    })
  }
}