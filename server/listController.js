const { sendErrorForwardNoFile, checkForContentTypeBeforeSending } = require('./helpers')

const sendErrorForward = sendErrorForwardNoFile('list controller')

let listController = {
    getLists: (req, res) => {
        const db = req.app.get('db')
        db.get.lists(req.user.id).then(results => {
            checkForContentTypeBeforeSending(res, results)
        }).catch(e => sendErrorForward('get list for user', e, res))
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
    addBeastToList: ({app, body}, res) => {
        const db = app.get('db')
        db.add.beastToList(body.beastid, body.listid, null).then(result => {
            checkForContentTypeBeforeSending(res, { message: `Monster was added to random encounter list`, color: 'green' })
        }).catch(e => sendErrorForward('add beast to list', e, res))
    }
}

module.exports = listController