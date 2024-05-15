const { consoleLogErrorNoFile, sendErrorForwardNoFile, checkForContentTypeBeforeSending } = require('./helpers')

const consoleLogError = consoleLogErrorNoFile('catalog ctrl')
const sendErrorForward = sendErrorForwardNoFile('catalog ctrl')

let catalogObj = {
    catalogCache: [],
    newCache: [],
    getCustomCatalog: (req, res) => {
        let customCatalog = []
        catalogObj.collectCustomCatalog(req, res, 0, customCatalog)
    },
    collectCustomCatalog: (req, res, index = 0, customCatalog) => {
        const db = req.app.get('db')
        let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        if (alphabet[index]) {
            db.get.catalogByLetterCustom(alphabet[index], req.user.id).then(result => {
                let finalArray = []
                if (result.length > 0) {
                    customCatalog.push(result)
                }

                result = result.map(beast => {
                    finalArray.push(db.get.rolesforcatalog(beast.id).then(result => {
                        beast.roles = result
                        if (!beast.defaultrole && beast.roles.length > 0) {
                            beast.defaultrole = beast.roles[0].id
                        }
                        if (beast.defaultrole) {
                            for (let i = 0; i < beast.roles.length; i++) {
                                if (beast.roles[i].id === beast.defaultrole) {
                                    beast.role = beast.roles[i].role
                                    beast.secondaryrole = beast.roles[i].secondaryrole
                                    beast.socialrole = beast.roles[i].socialrole
                                    beast.skillrole = beast.roles[i].skillrole
                                    beast.rarity = beast.roles[i].rarity
                                    i = beast.roles.length
                                }
                            }
                        }
                        return result
                    }).catch(e => sendErrorForward('roles for custom catalog by alpha', e)))
                })

                Promise.all(finalArray).then(_ => {
                    catalogObj.collectCustomCatalog(req, res, ++index, customCatalog)
                }).catch(e => sendErrorForward('custom collect cache final promise', e))
            }).catch(e => sendErrorForward('custom catalog by letter', e))
        } else {
            checkForContentTypeBeforeSending(res, customCatalog)
        }
    },
    collectCatalog(app) {
        const db = app.get('db')
        db.get.catalogallview().then(result => {
            let finalArray = []
            if (result.length > 0) {
                this.newCache.push(result)
            }

            result = result.map(beast => {
                finalArray.push(db.get.rolesforcatalog(beast.id).then(result => {
                    beast.roles = result
                    if (!beast.defaultrole && beast.roles.length > 0) {
                        beast.defaultrole = beast.roles[0].id
                    }
                    if (beast.defaultrole) {
                        for (let i = 0; i < beast.roles.length; i++) {
                            if (beast.roles[i].id === beast.defaultrole) {
                                beast.role = beast.roles[i].role
                                beast.secondaryrole = beast.roles[i].secondaryrole
                                beast.socialrole = beast.roles[i].socialrole
                                beast.skillrole = beast.roles[i].skillrole
                                beast.rarity = beast.roles[i].rarity
                                i = beast.roles.length
                            }
                        }
                    }
                    return result
                }).catch(e => consoleLogError('get roles for catalog', e)))
            })

            Promise.all(finalArray).then(_ => {
                db.get.catalogtemplates().then(result => {
                    let finalArray = []
                    if (result.length > 0) {
                        this.newCache.push(result)
                    }

                    result = result.map(beast => {
                        finalArray.push(db.get.rolesfortemplatecatalog(beast.id).then(result => {
                            beast.roles = result
                            if (!beast.defaultrole && beast.roles.length > 0) {
                                beast.defaultrole = beast.roles[0].id
                            }
                            if (beast.defaultrole) {
                                for (let i = 0; i < beast.roles.length; i++) {
                                    if (beast.roles[i].id === beast.defaultrole) {
                                        beast.role = beast.roles[i].role
                                        beast.secondaryrole = beast.roles[i].secondaryrole
                                        beast.socialrole = beast.roles[i].socialrole
                                        beast.skillrole = beast.roles[i].skillrole
                                        beast.rarity = beast.roles[i].rarity
                                        i = beast.roles.length
                                    }
                                }
                            }
                            return result
                        }).catch(e => consoleLogError('collect roles for templates', e)))
                    })

                    Promise.all(finalArray).then(_ => {
                        this.collectCache(app, 0)
                    }).catch(e => consoleLogError('catalog final promise', e))
                }).catch(e => consoleLogError('templates catagory', e))
            }).catch(e => consoleLogError('collect catagory promise', e))
        }).catch(e => consoleLogError('collect catagory outer', e))
    },
    collectCache(app, index) {
        const db = app.get('db')
        let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        if (alphabet[index]) {
            db.get.catalogbyletter(alphabet[index]).then(result => {
                let finalArray = []
                if (result.length > 0) {
                    this.newCache.push(result)
                }

                result = result.map(beast => {
                    finalArray.push(db.get.rolesforcatalog(beast.id).then(result => {
                        beast.roles = result
                        if (!beast.defaultrole && beast.roles.length > 0) {
                            beast.defaultrole = beast.roles[0].id
                        }
                        if (beast.defaultrole) {
                            for (let i = 0; i < beast.roles.length; i++) {
                                if (beast.roles[i].id === beast.defaultrole) {
                                    beast.role = beast.roles[i].role
                                    beast.secondaryrole = beast.roles[i].secondaryrole
                                    beast.socialrole = beast.roles[i].socialrole
                                    beast.skillrole = beast.roles[i].skillrole
                                    beast.rarity = beast.roles[i].rarity
                                    i = beast.roles.length
                                }
                            }
                        }
                        return result
                    }).catch(e => consoleLogError('roles for catalog by alpha', e)))
                })

                Promise.all(finalArray).then(_ => {
                    this.collectCache(app, ++index)
                }).catch(e => consoleLogError('collect cache final promise', e))
            }).catch(e => consoleLogError('catalog by letter', e))
        } else {
            this.catalogCache = this.newCache
            this.newCache = []
            console.log('bestiary catalog collected')
        }
    },
}

module.exports = catalogObj