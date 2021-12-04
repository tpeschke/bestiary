String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};

function createStringId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 50; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

let obstacleController = {
    catalogCache: [],
    newCache: [],
    collectCache(app, index) {
        const db = app.get('db')
        let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        if (alphabet[index]) {
            db.get.obstacle.catalogbyletter(alphabet[index]).then(result => {
                let finalArray = []
                if (result.length > 0) {
                    this.newCache.push(result)
                } else {
                    this.newCache.push(alphabet[index])
                }

                Promise.all(finalArray).then(_ => {
                    this.collectCache(app, ++index)
                })
            })
        } else {
            this.catalogCache = this.newCache
            this.newCache = []
            console.log('obstacle catalog collected')
        }
    },
    add: (req, res) => {
        if (req.body.type === 'obstacle') {
            obstacleController.addObstacle(req, res)
        } else if (req.body.type === 'challenge') {
            obstacleController.addChallenge(req, res)
        }
    },
    addObstacle: (req, res) => {
        const db = req.app.get('db')
        let { stringid, complicationsingle, difficulty, failure, information, name, notes, pairone, pairtwo, success, threshold, time, type, complicationtable } = req.body

        if (!stringid) {
            stringid = createStringId()
        }

        db.add.obstacle.base(stringid, complicationsingle, difficulty, failure, information, name, notes, success, threshold, time, type, complicationtable).then(_ => {
            let promiseArray = []

            promiseArray.push(db.delete.obstacle.pairs([stringid, [0, ...pairone.map(pairone => pairone.id)], 'pairone']).then(_ => {
                return pairone.map(({ id: paironeid, name, body, index }) => {
                    return db.add.obstacle.pairs(paironeid, stringid, name, body, 'pairone', index)
                })
            }).catch(e => console.log("pair one ~ ", e)))
            promiseArray.push(db.delete.obstacle.pairs([stringid, [0, ...pairtwo.map(pairtwo => pairtwo.id)], 'pairtwo']).then(_ => {
                return pairtwo.map(({ id: pairtwoid, name, body, index }) => {
                    return db.add.obstacle.pairs(pairtwoid, stringid, name, body, 'pairtwo', index)
                })
            }).catch(e => console.log("pair two ~ ", e)))

            promiseArray.push(db.delete.obstacle.comps([stringid, [0, ...complicationtable.map(complicationtable => complicationtable.id)], 'complicationtable']).then(_ => {
                return complicationtable.map(({ id: complicationtableid, name, body, index }) => {
                    return db.add.obstacle.comps(complicationtableid, stringid, name, body, index)
                })
            }).catch(e => console.log("complication table ~ ", e)))

            Promise.all(promiseArray).then(_ => {
                obstacleController.collectCache(req.app, 0)
                res.send({ color: 'green', message: `${type.toProperCase()} added successfully` })
            })
        })
    },
    addChallenge: (req, res) => {
        const db = req.app.get('db')
        let { id, type, name, flowchart, notes } = req.body
        if (id) {
            db.update.obstacle.challenge(type, name, flowchart, notes, id).then(result => {
                obstacleController.collectCache(req.app, 0)
                res.send({ color: 'green', message: `${type.toProperCase()} added successfully` })
            }).catch(e => console.log('Add challenge', e))
        } else {
            db.add.obstacle.challenge(type, name, flowchart, notes).then(result => {
                obstacleController.collectCache(req.app, 0)
                res.send({ color: 'green', message: `${type.toProperCase()} added successfully` })
            }).catch(e => console.log('Add challenge', e))
        }
    },
    get: (req, res) => {
        if (req.query.type === 'obstacle' || !req.query.type) {
            obstacleController.getObstacle(req, res)
        } else if (req.query.type === 'challenge') {
            obstacleController.getChallenge(req, res)
        }
    },
    getObstacle: (req, res) => {
        const db = req.app.get('db')
            , id = req.params.id

        if (id > 0) {
            db.get.obstacle.base(id).then(obstacle => {
                obstacle = obstacle[0]
                let promiseArray = []
    
                promiseArray.push(db.get.obstacle.pairs(obstacle.stringid, 'pairone').then(pairs => {
                    obstacle.pairone = pairs
                    return true
                }))
                promiseArray.push(db.get.obstacle.pairs(obstacle.stringid, 'pairtwo').then(pairs => {
                    obstacle.pairtwo = pairs
                    return true
                }))
    
                promiseArray.push(db.get.obstacle.comps(obstacle.stringid).then(complicationtable => {
                    obstacle.complicationtable = complicationtable
                    return true
                }))
    
                Promise.all(promiseArray).then(_ => {
                    res.send(obstacle)
                })
            })
        } else {
            res.send({})
        }
    },
    getChallenge: (req, res) => {
        const db = req.app.get('db')
            , id = req.params.id

        db.get.obstacle.challenges(id).then(challenge => {
            challenge = challenge[0]
            res.send(challenge)
        })
    },
    deleteObstacle: (req, res) => {
        const db = req.app.get('db')
        let promiseArray = []
            , id = req.params.id.split(',')

        
        if (typeof id === 'string') {
            db.get.obstacle.stringid(id).then(stringid => {
                stringid = stringid[0]
                promiseArray.push(db.delete.obstacle.allpairs(stringid.stringid).then())
                promiseArray.push(db.delete.obstacle.allcomps(stringid.stringid).then())
                promiseArray.push(db.delete.obstacle.obstacle(id).then())
    
                Promise.all(promiseArray).then(_ => {
                    obstacleController.collectCache(req.app, 0)
                    res.send({ color: 'green', message: `Obstacle deleted successfully` })
                })
            })
        } else {
            db.delete.obstacle.challenges(id).then(result => {
                obstacleController.collectCache(req.app, 0)
                res.send({ color: 'green', message: `Challenge deleted successfully` })
            })
        }
    },
    search: (req, res) => {
        const db = req.app.get('db')
        let promiseArray = []
            , obstacleArray = []

        db.get.obstacle.search(req.query.search).then(obstacles => {
            obstacleArray = obstacles
            obstacles.forEach((obstacle, i) => {
                promiseArray.push(db.get.obstacle.pairs(obstacle.stringid, 'pairone').then(pairs => {
                    obstacleArray[i].pairone = pairs
                    return true
                }))
                promiseArray.push(db.get.obstacle.pairs(obstacle.stringid, 'pairtwo').then(pairs => {
                    obstacleArray[i].pairtwo = pairs
                    return true
                }))

                promiseArray.push(db.get.obstacle.comps(obstacle.stringid).then(complicationtable => {
                    obstacle.complicationtable = complicationtable
                    return true
                }))
            })
            Promise.all(promiseArray).then(_ => {
                res.send(obstacleArray)
            })
        })
    },
    isValid: (req, res) => {
        const db = req.app.get('db')
        let name = req.params.name

        db.get.obstacle.byName(name).then(id => {
            id = id[0]
            if (!id) {
                res.send({ id: false })
            } else {
                res.send({ id: id.id })
            }
        })
    }
}

module.exports = obstacleController