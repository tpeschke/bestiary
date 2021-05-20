module.exports = {
  getSingleBeast(req, res) {
    const id = +req.params.id
    let db
    req.db ? db = req.db : db = req.app.get('db')
    db.get.beastmaininfo(id).then(result => {
      let beast = result[0]
        , promiseArray = []
      let patreonTestValue = 0;

      if (beast.playercanview) {
        patreonTestValue = 1000
      } else if (req.user) {
        if (req.user.id === 1 || req.user.id === 21) {
          patreonTestValue = 1000
        } else if (req.user && req.user.patreon) {
          patreonTestValue = req.user.patreon
        }
      }

      if (beast.patreon > patreonTestValue) {
        res.sendStatus(401).send({ color: 'red', message: 'You need to update your Patreon tier to access this monster' })
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
          beast.combat = result
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
          beast.lairloot = {...result[0], ...beast.lairloot}
          return result
        }))
        
        promiseArray.push(db.get.loot.alms(id).then(result => {
          beast.lairloot = {...result, ...beast.lairloot}
          return result
        }))

        promiseArray.push(db.get.loot.equipment(id).then(result => {
          beast.lairloot = {equipment: result, ...beast.lairloot}
          return result
        }))

        promiseArray.push(db.get.loot.scrolls(id).then(result => {
          beast.lairloot = {scrolls: result, ...beast.lairloot}
          return result
        }))

        promiseArray.push(db.get.loot.traited(id).then(result => {
          beast.lairloot = {traited: result, ...beast.lairloot}
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
}