module.exports = {
  makeMonsters(startingLetter) {
    let number = Math.floor(Math.random() * 25)
    let temporaryBeast = []

    for (let i = 1; i < number + 2; i++) {
      let nameLength = Math.floor(Math.random() * 15)
      let name = startingLetter + this.makeName(nameLength + 2)
      temporaryBeast.push({
        id: i,
        name,
        hr: Math.floor(Math.random() * 200),
        intro: `this is ths ${name}'s introduction`,
        habitat: `this is where the ${name} lives`,
        ecology: `this is ${name}'s ecology`,
        number_min: Math.floor(Math.random() * 5),
        number_max: Math.floor(Math.random() * 500),
        senses: `this is how the ${name} sees`,
        diet: `this is what the ${name} eats`,
        meta: `this is how to use the ${name}`,
        sp_atk: `the ${name} can dance`,
        sp_def: `the ${name} can't jive`,
        tactics: `this is how the ${name} fights`,
        size: 'M',
        subsystem: 1,
        patreon: Math.floor(Math.random() * 40),
        vitality: '5d8 + 30',
        panic: 1,
        broken: 4,
        types: [
          Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1
        ],
        environ: [
          Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1
        ],
        combat: [
          {
            weapon: 'longsword',
            spd: Math.floor(Math.random() * 20),
            atk: Math.floor(Math.random() * 5),
            init: Math.floor(Math.random() * 5),
            def: Math.floor(Math.random() * 10),
            encumb: Math.floor(Math.random() * 40),
            dr: '4/d + 8',
            measure: Math.floor(Math.random() * 10),
            damage: '2d6! +d8! +d10! +4d4!',
            parry: Math.floor(Math.random() * 4)
          },
          {
            weapon: 'a really pointy stick, I guess',
            spd: Math.floor(Math.random() * 20),
            atk: Math.floor(Math.random() * 5),
            init: Math.floor(Math.random() * 5),
            def: Math.floor(Math.random() * 10),
            encumb: Math.floor(Math.random() * 40),
            dr: '4/d + 8',
            shield_dr: null,
            measure: Math.floor(Math.random() * 10),
            damage: '2d6! +4d4! +20',
            parry: Math.floor(Math.random() * 4)
          },
          {
            weapon: 'his bare hands',
            spd: Math.floor(Math.random() * 20),
            atk: Math.floor(Math.random() * 5),
            init: Math.floor(Math.random() * 5),
            def: Math.floor(Math.random() * 10),
            encumb: Math.floor(Math.random() * 40),
            dr:'4/d + 8',
            shield_dr: '2/d+2',
            measure: Math.floor(Math.random() * 10),
            damage: '2d6! +d8! +d10! +4d4! +5',
            parry: Math.floor(Math.random() * 4)
          }
        ],
        movement: [{
          stroll: Math.floor(Math.random() * 5) + 1 + " ft/sec",
          walk: Math.floor(Math.random() * 5) + 1 + " ft/sec",
          jog: Math.floor(Math.random() * 5) + 1 + " ft/sec",
          run: Math.floor(Math.random() * 5) + 1 + " ft/sec",
          sprint: Math.floor(Math.random() * 5) + 1 + " ft/sec",
          type: 'land'
        },
        {
          stroll: Math.floor(Math.random() * 5) + 1 + " ft/sec",
          walk: Math.floor(Math.random() * 5) + 1 + " ft/sec",
          jog: Math.floor(Math.random() * 5) + 1 + " ft/sec",
          run: Math.floor(Math.random() * 5) + 1 + " ft/sec",
          sprint: Math.floor(Math.random() * 5) + 1 + " ft/sec",
          type: 'fly'
        }
        ],
        image: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/200/300`
      })
    }

    return temporaryBeast
  },
  makeName(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (var i = 0; i < length - 1; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  },
  // ACTUAL FUNCTIONS
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