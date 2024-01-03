const {sendErrorForwardNoFile, checkForContentTypeBeforeSending} = require('./helpers')

const sendErrorForward = sendErrorForwardNoFile('search controller')

module.exports = {
    searchName: (req, res) => {
        const db = req.app.get('db')
            , name = req.params.name
        db.get.search.name_return_name(name).then(result => {
            checkForContentTypeBeforeSending(res, result)
        })
    },
    search: (req, res) => {
        const db = req.app.get('db')
        let idArray = []

        for (item in req.query) {
            switch (item) {
                case "name":
                    idArray.push(db.get.search.name(req.query.name).catch(e => sendErrorForward('search name', e, res)))
                    break;
                case "body":
                    idArray.push(db.get.search.body(req.query.body).catch(e => sendErrorForward('search body', e, res)))
                    break;
                case "minHr":
                    idArray.push(db.get.search.minHr(req.query.minHr).catch(e => sendErrorForward('search min hr', e, res)))
                    break;
                case "maxHr":
                    idArray.push(db.get.search.maxHr(req.query.maxHr).catch(e => sendErrorForward('search max hr', e, res)))
                    break;
                case "size":
                    idArray.push(db.get.search.size(req.query.size).catch(e => sendErrorForward('search size', e, res)))
                    break;
                case "access":
                    idArray.push(db.get.search.access(req.query.access).catch(e => sendErrorForward('search access', e, res)))
                    break;
                case "rarity":
                    idArray.push(db.get.search.rarity(req.query.rarity).catch(e => sendErrorForward('search rarity', e, res)))
                    break;
                case "subsystem":
                    if (req.query.subsystem !== "NaN") {
                        idArray.push(db.get.search.subsystem(req.query.subsystem).catch(e => sendErrorForward('search subsystem', e, res)))
                    }
                    break;
                case "anyaccess":
                    idArray.push(db.get.search.playerview().catch(e => sendErrorForward('search player can view', e, res)))
                    break;
                case "personalNotes":
                    if (req.user) {
                        idArray.push(db.get.search.personalNotes(req.user.id).catch(e => sendErrorForward('search personal notes', e, res)))
                    }
                    break;
                case "climate":
                    if (req.query.climate !== '') {
                        req.query.climate.split(',').forEach(val => {
                            idArray.push(db.get.search.climate(+val).catch(e => sendErrorForward('search climate', e, res)))
                        })
                    }
                    break;
                case "types":
                    if (req.query.types !== '') {
                        req.query.types.split(',').forEach(val => {
                            idArray.push(db.get.search.types(+val).catch(e => sendErrorForward('search types', e, res)))
                        })
                    }
                    break;
                case "roles":
                    if (req.query.roles !== '') {
                        req.query.roles.split(',').forEach(val => {
                            let roleName = getRoleName(val)
                            if (+val < 11) {
                                idArray.push(db.get.search.roles_confrontation(roleName).then(result => result).catch(e => sendErrorForward('search roles confrontation', e, res)))
                            } else if (+val > 10 && +val < 22) {
                                idArray.push(db.get.search.roles_combat(roleName).then(result => result).catch(e => sendErrorForward('search roles combat', e, res)))
                            } else {
                                idArray.push(db.get.search.roles_skill(roleName).then(result => result).catch(e => sendErrorForward('search roles skills', e, res)))
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
                        beastArray.push(db.get.search.beastPreviewOwner(id).then(result => result[0]).catch(e => sendErrorForward('preview owner', e, res)))
                    } else if (req.user.patreon >= 3) {
                        beastArray.push(db.get.search.beastPreviewGM(id, req.user.id).then(result => result[0]).catch(e => sendErrorForward('preview GM', e, res)))
                    }
                } else {
                    beastArray.push(db.get.search.beastPreviewPlayer(id).then(result => result[0]).catch(e => sendErrorForward('preview player', e, res)))
                }
            })

            Promise.all(beastArray).then(finalArray => {
                // the final fitler removes null values for player search
                checkForContentTypeBeforeSending(res, finalArray.filter(x => x).sort((a, b) => a.name < b.name ? -1 : 1))
            }).catch(e => sendErrorForward('search final promise 2', e, res))
        }).catch(e => sendErrorForward('search final promise', e, res))
    },
    getRandomMonster: (req, res) => {
        const db = req.app.get('db')
        let patreon = 0
        if (req.user) {
            patreon = req.user.patreon
        }
        db.get.search.randomMonster(patreon).then(data => {
            checkForContentTypeBeforeSending(res, data[0])
        }).catch(e => sendErrorForward('random monster', e, res))
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