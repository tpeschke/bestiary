const { promise } = require('protractor')
const { sendErrorForwardNoFile, checkForContentTypeBeforeSending } = require('./helpers')

const sendErrorForward = sendErrorForwardNoFile('list controller')

let listController = {
    getLists: (req, res) => {
        const db = req.app.get('db')
        db.get.lists(req.user.id).then(results => {
            checkForContentTypeBeforeSending(res, results)
        }).catch(e => sendErrorForward('get list for user', e, res))
    },
    getListsWithBeasts: (req, res) => {
        const db = req.app.get('db')
        db.get.lists(req.user.id).then(lists => {
            promiseArray = []
            lists.forEach(list => {
                promiseArray.push(db.get.beastsInList(list.id).then(beasts => {
                    list.beasts = beasts
                    return true
                }))
            })
            Promise.all(promiseArray).then(_=>{
                checkForContentTypeBeforeSending(res, lists)
            })
        }).catch(e => sendErrorForward('get list for user 3', e, res))
    },
    addList: (req, res) => {
        const db = req.app.get('db')
        db.add.list(req.user.id).then(result => {
            checkForContentTypeBeforeSending(res, result)
        }).catch(e => sendErrorForward('add list', e, res))
    },
    addBeastToList: ({app, body, user}, res) => {
        const db = app.get('db')
        const {beastid, listid, beastidarray, rarity} = body
        if (listid) {
            addBeasts(res, db, beastidarray ? beastidarray : [{beastid, rarity}], listid, false)
        } else {
            db.add.list(user.id).then(newList => {
                addBeasts(res, db, beastidarray ? beastidarray : [{beastid, rarity}], newList[0].id, true)
            }).catch(e => sendErrorForward('add list 2', e, res))
        }
    },
    updateListName: ({app, body}, res) => {
        const db = app.get('db')
        db.update.list.name(body.name, body.id).then(result => {
            checkForContentTypeBeforeSending(res, result)
        }).catch(e => sendErrorForward('update list name', e, res))
    },
    updateBeastRarity: ({app, body}, res) => {
        const db = app.get('db')
        const {rarity, entryid} = body
        db.update.list.rarity(+rarity, entryid).then(result => {
            checkForContentTypeBeforeSending(res, result)
        }).catch(e => sendErrorForward('update beast rarity', e, res))
    },
    deleteBeastFromList: (req, res) => {
        const db = req.app.get('db')
        let id = +req.params.id
        db.delete.list.entry(id).then(_ => {
            checkForContentTypeBeforeSending(res, { message: `Entry was successfully deleted from list`, color: 'green' })
        }).catch(e => sendErrorForward('delete beast', e, res))
    },
    deleteList: (req, res) => {
        const db = req.app.get('db')
        let id = +req.params.id
        db.delete.list.allEntries(id).then(_ => {
            db.delete.list.list(id).then(_ => {
                checkForContentTypeBeforeSending(res, { message: `List was successfully deleted`, color: 'green' })
            }).catch(e => sendErrorForward('delete list', e, res))
        }).catch(e => sendErrorForward('delete all beasts in list', e, res))
    }
}

addBeasts = (res, db, beastidarray, listid, isNewList) => {
    let promiseArray = [];

    for (i = 0; i < beastidarray.length; i++) {
        promiseArray.push(db.add.beastToList(beastidarray[i].beastid, listid, beastidarray[i].rarity).catch(e => sendErrorForward('add beast to list', e, res)))
    }

    Promise.all(promiseArray).then(_ => {
        checkForContentTypeBeforeSending(res, { message: `Entry was added to ${isNewList ? 'new' : ''} random encounter list`, color: 'green' })
    })
}

module.exports = listController