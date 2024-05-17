const { createHash } = require('./helpers')
const { sendErrorForwardNoFile, checkForContentTypeBeforeSending } = require('./helpers')
const { callback } = require('./server-config')

const sendErrorForward = sendErrorForwardNoFile('list controller')

let listController = {
    getLists: (req, res) => {
        const db = req.app.get('db')
        if (req.user && req.user.id) {
            db.get.list.lists(req.user.id).then(results => {
                checkForContentTypeBeforeSending(res, results)
            }).catch(e => sendErrorForward('get list for user', e, res))
        } else {
            checkForContentTypeBeforeSending(res, [])
        }
    },
    getListByHash: (req, res) => {
        const db = req.app.get('db')
        let hash = req.params.hash
        db.get.list.byHash(hash).then(lists => {
            promiseArray = []
            lists.forEach(list => {
                promiseArray.push(db.get.list.beasts(list.id).then(beasts => {
                    list.beasts = beasts
                    return true
                }))
            })
            Promise.all(promiseArray).then(_ => {
                checkForContentTypeBeforeSending(res, lists[0])
            })
        }).catch(e => sendErrorForward('get list by hash', e, res))
    },
    getListsWithBeasts: (req, res) => {
        const db = req.app.get('db')
        if (req.user && req.user.id) {
            db.get.list.lists(req.user.id).then(lists => {
                promiseArray = []
                lists.forEach(list => {
                    promiseArray.push(db.get.list.beasts(list.id).then(beasts => {
                        list.beasts = beasts
                        return true
                    }))
                })
                Promise.all(promiseArray).then(_ => {
                    checkForContentTypeBeforeSending(res, lists)
                })
            }).catch(e => sendErrorForward('get list for user 3', e, res))
        } else {
            checkForContentTypeBeforeSending(res, [])
        }
    },
    getRandomMonsterFromList: (req, res) => {
        const db = req.app.get('db')
        let listid = req.params.listid
        db.get.list.randomBeast(listid).then(beast => {
            checkForContentTypeBeforeSending(res, beast[0])
        }).catch(e => sendErrorForward('get random beast', e, res))
    },
    addList: (req, res) => {
        const db = req.app.get('db')
        db.add.list(req.user.id, createHash()).then(result => {
            checkForContentTypeBeforeSending(res, result)
        }).catch(e => sendErrorForward('add list', e, res))
    },
    addBeastToList: ({ app, body, user }, res) => {
        const db = app.get('db')
        const { beastid, listid, beastidarray, rarity } = body
        db.get.list.beastCount(listid).then(result => {
            const stopsLeft = (req.user.patreon ? (req.user.patreon * 25) + 50 : 50) - result[0].count 
            if (listid) {
                addBeasts(res, db, beastidarray ? beastidarray : [{ beastid, rarity }], listid, false, stopsLeft)
            } else {
                db.add.list(user.id).then(newList => {
                    addBeasts(res, db, beastidarray ? beastidarray : [{ beastid, rarity }], newList[0].id, true, stopsLeft)
                }).catch(e => sendErrorForward('add list 2', e, res))
            }
        })
    },
    updateListName: ({ app, body }, res) => {
        const db = app.get('db')
        db.update.list.name(body.name, body.listid).then(result => {
            checkForContentTypeBeforeSending(res, result)
        }).catch(e => sendErrorForward('update list name', e, res))
    },
    updateBeastRarity: ({ app, body }, res) => {
        const db = app.get('db')
        const { rarity, entryid } = body
        db.update.list.rarity(+rarity, entryid).then(result => {
            checkForContentTypeBeforeSending(res, result)
        }).catch(e => sendErrorForward('update beast rarity', e, res))
    },
    deleteBeastFromList: (req, res) => {
        const db = req.app.get('db')
        let id = +req.params.entryid
        db.delete.list.entry(id).then(_ => {
            checkForContentTypeBeforeSending(res, { message: `Entry was successfully deleted from list`, color: 'green' })
        }).catch(e => sendErrorForward('delete beast', e, res))
    },
    deleteList: (req, res) => {
        const db = req.app.get('db')
        let id = +req.params.listid
        db.delete.list.allEntries(id).then(_ => {
            db.delete.list.list(id).then(_ => {
                checkForContentTypeBeforeSending(res, { message: `List was successfully deleted`, color: 'green' })
            }).catch(e => sendErrorForward('delete list', e, res))
        }).catch(e => sendErrorForward('delete all beasts in list', e, res))
    }
}

addBeasts = (res, db, beastidarray, listid, isNewList, stopsLeft) => {
    let promiseArray = [];

    for (i = 0; i < beastidarray.length || i < stopsLeft; i++) {
        promiseArray.push(db.add.beastToList(beastidarray[i].beastid, listid, beastidarray[i].rarity).catch(e => sendErrorForward('add beast to list', e, res)))
    }

    Promise.all(promiseArray).then(_ => {
        checkForContentTypeBeforeSending(res, { message: `Entry was added to ${isNewList ? 'new' : ''} random encounter list`, color: 'green' })
    })
}

module.exports = listController