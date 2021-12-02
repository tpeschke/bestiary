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
    addObstacle: (req, res) => {
        const db = req.app.get('db')
        let { stringid, complicationsingle, difficulty, failure, information, name, notes, pairone, pairtwo, success, threshold, time, type } = req.body

        if (!stringid) {
            stringid = createStringId()
        }

        db.add.obstacle.base(stringid, complicationsingle, difficulty, failure, information, name, notes, success, threshold, time, type).then(_ => {
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

            Promise.all(promiseArray).then(_ => {
                obstacleController.collectCache(req.app, 0)
                res.send({ color: 'green', message: `${type.toProperCase()} added successfully` })
            })
        })
    },
    getObstacle: (req, res) => {
        const db = req.app.get('db')
        , id = req.params.id

        db.get.obstacle.base(id).then(obstacle => {
            obstacle = obstacle[0]
            let promiseArray = []

            promiseArray.push(db.get.obstacle.pairs(obstacle.stringid, 'pairone').then( pairs => {
                obstacle.pairone = pairs
                return true
            }))
            promiseArray.push(db.get.obstacle.pairs(obstacle.stringid, 'pairtwo').then( pairs => {
                obstacle.pairtwo = pairs
                return true
            }))

            Promise.all(promiseArray).then(_ => {
                res.send(obstacle)
            })
        })
    },
    deleteObstacle: (req, res) => {
        const db = req.app.get('db')
        let promiseArray = []
        ,   id = req.params.id

        db.get.obstacle.stringid(id).then(stringid => {
            stringid = stringid[0]
            promiseArray.push(db.delete.obstacle.allpairs(stringid.stringid).then())
            promiseArray.push(db.delete.obstacle.obstacle(id).then())

            Promise.all(promiseArray).then(_ => {
                obstacleController.collectCache(req.app, 0)
                res.send({ color: 'green', message: `Obstacle deleted successfully` })
            })
        })
    }
}

module.exports = obstacleController