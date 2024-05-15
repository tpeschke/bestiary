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
    updateListName: ({app, body}, res) => {
        const db = app.get('db')
        db.update.listName(body.name, body.id).then(result => {
            checkForContentTypeBeforeSending(res, result)
        }).catch(e => sendErrorForward('update list name', e, res))
    },
    addBeastToList: ({app, body, user}, res) => {
        const db = app.get('db')
        if (body.listid) {
            db.add.beastToList(body.beastid, body.listid, null).then(result => {
                checkForContentTypeBeforeSending(res, { message: `Monster was added to random encounter list`, color: 'green' })
            }).catch(e => sendErrorForward('add beast to list', e, res))
        } else {
            db.add.list(user.id).then(newList => {
                db.add.beastToList(body.beastid, newList[0].id, null).then(result => {
                    checkForContentTypeBeforeSending(res, { message: `Monster was added to a new random encounter list`, color: 'green' })
                }).catch(e => sendErrorForward('add beast to list 2', e, res))
            }).catch(e => sendErrorForward('add list 2', e, res))
        }
    }
}

module.exports = listController