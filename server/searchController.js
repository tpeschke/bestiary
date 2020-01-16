module.exports = {
    search: (req, res) => {
        const db = req.app.get('db')
        let idArray = []

        for (item in req.query) {
            switch (item) {
                case "name":
                    idArray.push(db.get.search.name(req.query.name).then())
                    break;
                case "body":
                    idArray.push(db.get.search.body(req.query.body).then())
                    break;
                case "minHr":
                    idArray.push(db.get.search.minHr(req.query.minHr).then())
                    break;
                case "maxHr":
                    idArray.push(db.get.search.maxHr(req.query.maxHr).then())
                    break;
                case "minAppearing":
                    idArray.push(db.get.search.minAppearing(req.query.minAppearing).then())
                    break;
                case "maxAppearing":
                    idArray.push(db.get.search.maxAppearing(req.query.maxAppearing).then())
                    break;
                case "minInt":
                    idArray.push(db.get.search.minInt(req.query.minInt).then())
                    break;
                case "maxInt":
                    idArray.push(db.get.search.maxInt(req.query.maxInt).then())
                    break;
                case "size":
                    idArray.push(db.get.search.size(req.query.size).then())
                    break;
                case "access":
                    idArray.push(db.get.search.access(req.query.access).then())
                    break;
                case "subsystem":
                    if (req.query.subsystem !== "NaN") {
                        idArray.push(db.get.search.subsystem(req.query.subsystem).then())
                    }
                    break;
                // case "personalNotes":
                //     idArray.push(db.get.search.personalNotes(req.query.personalNotes))
                //     break;
                case "environ":
                    if (req.query.environ !== '') {
                        req.query.environ.split(',').forEach(val => {
                            idArray.push(db.get.search.environ(+val).then())
                        })
                    }
                    break;
                case "types":
                    if (req.query.types !== '') {
                        req.query.types.split(',').forEach(val => {
                            idArray.push(db.get.search.types(+val).then())
                        })
                    }
                    break;
            }
        }

        Promise.all(idArray).then(ids => {
            let idCountObj = {}
                , finalIdArray = []
                , beastArray = []
                , queryLength = ids.length

            if (queryLength > 1) {
                ids.forEach(innerIdArray => {
                    innerIdArray.forEach(val => {
                        if (!isNaN(idCountObj[val.id])) {
                            idCountObj[val.id] = ++idCountObj[val.id]
                            if (idCountObj[val.id] === queryLength) {
                                finalIdArray.push(val.id)
                                idCountObj[val.id] = true
                            }
                        } else if (!idCountObj[val.id]) {
                            idCountObj[val.id] = 1
                        }
                    })
                })
            } else if (ids.length !== 0) {
                ids[0].forEach(val => {
                    finalIdArray.push(val.id)
                })
            }

            // add in logic that if the finalIdArray is empty, 
            // than to check the ids with the next highest count 
            // (queryLength - 1) and so on until you get something back

            finalIdArray.forEach(id => {
                if (req.user.id === 1 || req.user.id === 21) {
                    beastArray.push(db.get.search.beastPreviewOwner(id).then(result => result[0]))
                } else if (req.user.patreon >= 3) {
                    beastArray.push(db.get.search.beastPreviewGM(id).then(result => result[0]))
                } else {
                    beastArray.push(db.get.search.beastPreviewPlayer(id).then(result => result[0]))
                }
            })

            Promise.all(beastArray).then(finalArray => {
                // the final fitler removes null values for player search
                res.send(finalArray.filter(x => x).sort((a, b) => a.name < b.name ? -1 : 1))
            })
        })
    }
}