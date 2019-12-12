const express = require('express')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , massive = require('massive')
    , { server, connection } = require('./server-config')
    , ctrl = require('./controller')
    upload = require('./file-upload');

const app = new express()
app.use(bodyParser.json({ limit: '10mb' }))
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
            patreon: 2
        }
    }
    next();
})

app.get('/api/beasts/catalog', (req, res) => res.send(ctrl.catalogCache))
app.get('/api/beasts/:id', ctrl.getSingleBeast)
app.get('/api/auth/me', (req, res) => req.user ? res.send(req.user) : res.send({id: 0}))

app.use((req, res, next) => {
    if (!req.user) {
        res.sendStatus(401)
    } else if (req.user.id !== 1 && req.user.id !== 21) {
        res.sendStatus(401)
    } else {
        next()
    }
})

app.patch('/api/beasts/edit', ctrl.editBeast)

app.post('/api/beasts/add', ctrl.addBeast)
app.post('/api/v1/upload/:id', upload.array('image', 1), (req, res) => res.send({ image: req.file }));

app.delete('/api/beasts/delete/:id', ctrl.deleteBeast)
// ================================== \\

massive(connection).then(dbI => {
    app.set('db', dbI)
    app.listen(server, _ => {
        ctrl.collectCache(app, 0)
        console.log(`Sing to me a sweet song of forgetfulness and Ill die on your shore ${server}`)
    })
})