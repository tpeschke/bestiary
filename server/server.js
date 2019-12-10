const express = require('express')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , massive = require('massive')
    , { server, connection } = require('./server-config')
    , ctrl = require('./controller')

const app = new express()
app.use(bodyParser.json())
app.use(cors())

/////////////////////////////////
//TESTING TOPLEVEL MIDDLEWARE////
///COMMENT OUT WHEN AUTH0 READY///
/////////////////////////////////
app.use((req, res, next) => {
    if (!req.user) {
        req.user = {
            id: 1,
            email: "mr.peschke@gmail.com",
            patreon: 1
        }
    }
    next();
})

let beasts = []
let fakeBeastDB = []

let letterArray = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

for (let i = 0; i < letterArray.length; i++) {
    let newBeast = ctrl.makeMonsters(letterArray[i])
    beasts.push(newBeast)
    fakeBeastDB.push(...newBeast)
}

app.get('/api/beasts/catalog', (req, res) => res.send(beasts))
app.get('/api/beasts/:id', (req, res) => res.send(fakeBeastDB[+req.params.id - 1]))

app.patch('/api/beasts/edit', (req, res) => {
    fakeBeastDB[+req.body.id - 1] = req.body;
    res.status(200).send({done: true})
})

app.post('/api/beasts/add', ctrl.addBeast)
// ================================== \\

massive(connection).then(dbI => {
    app.set('db', dbI)
    app.listen(server, _ => {
        console.log(`Sing to me a sweet song of forgetfulness and Ill die on your shore ${server}`)
    })
})