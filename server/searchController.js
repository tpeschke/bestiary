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
                case "anyaccess":
                    idArray.push(db.get.search.playerview().then())
                    break;
                case "personalNotes":
                    if (req.user) {
                        idArray.push(db.get.search.personalNotes(req.user.id))
                    }
                    break;
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
                case "roles":
                    if (req.query.roles !== '') {
                        req.query.roles.split(',').forEach(val => {
                            let roleName = getRoleName(val)
                            if (+val < 11) {
                                idArray.push(db.get.search.roles_confrontation(roleName).then(result => result))
                            } else if (+val > 10 && +val < 22) {
                                idArray.push(db.get.search.roles_combat(roleName).then(result => result))
                            } else {
                                idArray.push(db.get.search.roles_skill(roleName).then(result => result))
                            }
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
// might have an intersection function from lodash
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
                if (req.user) {
                    if (req.user.id === 1 || req.user.id === 21) {
                        beastArray.push(db.get.search.beastPreviewOwner(id).then(result => result[0]))
                    } else if (req.user.patreon >= 3) {
                        beastArray.push(db.get.search.beastPreviewGM(id).then(result => result[0]))
                    }
                } else {
                    beastArray.push(db.get.search.beastPreviewPlayer(id).then(result => result[0]))
                }
            })

            Promise.all(beastArray).then(finalArray => {
                // the final fitler removes null values for player search
                res.send(finalArray.filter(x => x).sort((a, b) => a.name < b.name ? -1 : 1))
            })
        })
    },
    getRandomMonster: (req, res) => {
        const db = req.app.get('db')
        db.get.search.randomMonster().then(data => {
            res.send(data[0])
        })
    }
}

getRoleName = (val) => {
    switch (+val) {
        case 1:
            return 'Striker'
        case 2:
            return 'Defender'
        case 3:
            return 'Fast-Talker'
        case 4:
            return 'Feinter'
        case 5:
            return 'Fodder'
        case 6:
            return 'Sandbagger'
        case 7:
            return 'Corruptor'
        case 8:
            return 'Gaslighter'
        case 9:
            return 'Enabler'
        case 10:
            return 'Opportunist'
        case 11:
            return 'Artillery'
        case 12:
            return 'Brute'
        case 13:
            return 'Captain'
        case 14:
            return 'Controller'
        case 15:
            return 'Defender'
        case 16:
            return 'Duelist'
        case 17:
            return 'Flanker'
        case 18:
            return 'Fodder'
        case 19:
            return 'Shock'
        case 20:
            return 'Skirmisher'
        case 21:
            return 'Solo'
        case 22:
            return 'Hunter'
        case 23:
            return 'Prey'
        case 24:
            return 'Controller'
        case 25:
            return 'Lock'
        case 26:
            return 'Conditional'
        case 27:
            return 'Antagonist'
        case 28:
            return 'Trap'
        case 29:
            return 'Hazard'
        case 30:
            return 'Fodder'
        default:
            return ''
    }
}