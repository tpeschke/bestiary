const {sendErrorForwardNoFile} = require('./helpers')

const sendErrorForward = sendErrorForwardNoFile('Obstacle controller')

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
                }).catch(e => sendErrorForward('catalog final promise', e, res))
            }).catch(e => sendErrorForward('catalog by letter', e, res))
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
            }).catch(e => sendErrorForward('obstacle pair 1', e, res)))
            promiseArray.push(db.delete.obstacle.pairs([stringid, [0, ...pairtwo.map(pairtwo => pairtwo.id)], 'pairtwo']).then(_ => {
                return pairtwo.map(({ id: pairtwoid, name, body, index }) => {
                    return db.add.obstacle.pairs(pairtwoid, stringid, name, body, 'pairtwo', index)
                })
            }).catch(e => sendErrorForward('obstacle pair 2', e, res)))

            promiseArray.push(db.delete.obstacle.comps([stringid, [0, ...complicationtable.map(complicationtable => complicationtable.id)], 'complicationtable']).then(_ => {
                return complicationtable.map(({ id: complicationtableid, name, body, index }) => {
                    return db.add.obstacle.comps(complicationtableid, stringid, name, body, index)
                })
            }).catch(e => sendErrorForward('obstacle complication table', e, res)))

            Promise.all(promiseArray).then(_ => {
                obstacleController.collectCache(req.app, 0)
                res.send({ color: 'green', message: `${type.toProperCase()} added successfully` })
            }).catch(e => sendErrorForward('obstacle final promise', e, res))
        }).catch(e => sendErrorForward('obstacle main', e, res))
    },
    addChallenge: (req, res) => {
        const db = req.app.get('db')
        let { id, type, name, flowchart, notes } = req.body
        if (id) {
            db.update.obstacle.challenge(type, name, flowchart, notes, id).then(result => {
                obstacleController.collectCache(req.app, 0)
                res.send({ color: 'green', message: `${type.toProperCase()} added successfully` })
            }).catch(e => sendErrorForward('add challenge 1', e, res))
        } else {
            db.add.obstacle.challenge(type, name, flowchart, notes).then(result => {
                obstacleController.collectCache(req.app, 0)
                res.send({ color: 'green', message: `${type.toProperCase()} added successfully` })
            }).catch(e => sendErrorForward('add challenge 2', e, res))
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
            , id = +req.params.id

        if (id > 0) {
            db.get.obstacle.base(id).then(obstacle => {
                obstacle = obstacle[0]
                let promiseArray = []
    
                promiseArray.push(db.get.obstacle.pairs(obstacle.stringid, 'pairone').then(pairs => {
                    obstacle.pairone = pairs
                    return true
                }).catch(e => sendErrorForward('get obstacle pair 1', e, res)))
                promiseArray.push(db.get.obstacle.pairs(obstacle.stringid, 'pairtwo').then(pairs => {
                    obstacle.pairtwo = pairs
                    return true
                }).catch(e => sendErrorForward('get obstacle pair 2', e, res)))
    
                promiseArray.push(db.get.obstacle.comps(obstacle.stringid).then(complicationtable => {
                    obstacle.complicationtable = complicationtable
                    return true
                }).catch(e => sendErrorForward('get obstacle complications', e, res)))
    
                Promise.all(promiseArray).then(_ => {
                    res.send(obstacle)
                })
            }).catch(e => sendErrorForward('get obstacle main', e, res))
        } else {
            res.send({})
        }
    },
    getChallenge: (req, res) => {
        const db = req.app.get('db')
            , id = req.params.id

        db.get.obstacle.challenges(id).then(challenge => {
            challenge = challenge[0]
            let promiseArray = []

            promiseArray.push(db.get.obstacle.relatedbeasts(challenge.id).then(result => {
                challenge.beasts = result
            }).catch(e => sendErrorForward('get challenge related beasts', e, res)))
            Promise.all(promiseArray).then(_ => {
                res.send(challenge)
            }).catch(e => sendErrorForward('get challenge final promise', e, res))
        }).catch(e => sendErrorForward('get challenge main', e, res))
    },
    deleteObstacle: (req, res) => {
        const db = req.app.get('db')
        let promiseArray = []
            , id = req.params.id.split(',')[0]

        if (!isNaN(+id)) {
            db.get.obstacle.stringid(id).then(stringid => {
                stringid = stringid[0]
                promiseArray.push(db.delete.obstacle.allpairs(stringid.stringid).catch(e => sendErrorForward('delete obstacle all pairs', e, res)))
                promiseArray.push(db.delete.obstacle.allcomps(stringid.stringid).catch(e => sendErrorForward('delete obstacle complications', e, res)))
                promiseArray.push(db.delete.obstacle.obstacle(id).catch(e => sendErrorForward('delete the obstacle', e, res)))
    
                Promise.all(promiseArray).then(_ => {
                    obstacleController.collectCache(req.app, 0)
                    res.send({ color: 'green', message: `Obstacle deleted successfully` })
                })
            }).catch(e => sendErrorForward('get obstacle for delete', e, res))
        } else {
            db.delete.obstacle.challenges(id).then(result => {
                obstacleController.collectCache(req.app, 0)
                res.send({ color: 'green', message: `Challenge deleted successfully` })
            }).catch(e => sendErrorForward('delete challenges', e, res))
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
                }).catch(e => sendErrorForward('search obstacle pair 1', e, res)))
                promiseArray.push(db.get.obstacle.pairs(obstacle.stringid, 'pairtwo').then(pairs => {
                    obstacleArray[i].pairtwo = pairs
                    return true
                }).catch(e => sendErrorForward('search obstacle pair 2', e, res)))

                promiseArray.push(db.get.obstacle.comps(obstacle.stringid).then(complicationtable => {
                    obstacle.complicationtable = complicationtable
                    return true
                }).catch(e => sendErrorForward('search obstacle complciations', e, res)))
            })
            Promise.all(promiseArray).then(_ => {
                db.get.obstacle.challengesearch(req.query.search).then(challenges => {
                    res.send({obstacles: obstacleArray, challenges})
                }).catch(e => sendErrorForward('search obstacle challenges', e, res))
            }).catch(e => sendErrorForward('search obstacle final promise', e, res))
        }).catch(e => sendErrorForward('search obstacle main', e, res))
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
        }).catch(e => sendErrorForward('get obstacle by name', e, res))
    }
}

module.exports = obstacleController