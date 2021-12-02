// complicationsingle: "Test Single Comp"
// difficulty: "Test Difficulty\nfewkop"
// failure: "Test Failure"
// information: "<ul><li>Test Info bullet</li><li class=\"ql-indent-1\">Test info bullet second level</li></ul>"
// name: "Test Name"
// notes: "<p>Test Notes</p>"
// pairone: [
//      {order: 0, name: 'Pair 1 1 name', body: 'Part 1 1 body'}
//      {name: 'Pair 1 2 name', body: 'Part 1 2 body', order: 1}
//    ]
// pairtwo: [
//      {order: 0, name: 'Pair 2 1 name', body: 'Part 2 1 body'}
//    ]
// success: "Test Success"
// threshold: "Test Threshold"
// time: "Test Time"
// type: "obstacle"
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
    }
}

module.exports = obstacleController