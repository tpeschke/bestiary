const express = require('express')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , massive = require('massive')
    , { server, databaseCredentials, secret, domain, client_id, client_secret, callback, fakeAuth } = require('./server-config')
    , ctrl = require('./controller')
    , searchCtrl = require('./searchController')
    , getCtrl = require('./getController')
    , obstCtrl = require('./obstacleController')
    , catalogCtrl = require('./catalogController')
    , squareCtrl = require('./combatSquare')
    , uploadMain = require('./file-upload/main')
    , uploadToken = require('./file-upload/token')
    , session = require('express-session')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0')
    , path = require("path")
    , equipmentCtrl = require('./equipmentController')
const { reset } = require('nodemon')

const { sendErrorForwardNoFile, checkForContentTypeBeforeSending } = require('./helpers')
const sendErrorForward = sendErrorForwardNoFile('train station')

const app = new express()
app.use(bodyParser.json({ limit: '10mb' }))
app.use(cors())

app.use(express.static(__dirname + `/../dist/bestiary`));
app.use(session({
    secret,
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strategy({
    domain,
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: callback,
    scope: 'openid profile'
}, function (accessToken, refreshToken, extraParams, profile, done) {
    let { displayName, user_id } = profile;
    const db = app.get('db');

    db.get.find_User([user_id]).then(function (users) {
        if (!users[0]) {
            db.add.create_User([
                displayName,
                user_id
            ]).then(users => {
                return done(null, users[0].id)
            })
        } else {
            return done(null, users[0].id)
        }
    })
}))

app.use(fakeAuth)

app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: `/`
}));

passport.serializeUser((id, done) => {
    done(null, id)
})
passport.deserializeUser((id, done) => {
    app.get('db').get.find_Session_User([id]).then((user) => {
        return done(null, user[0]);
    })
})

app.get('/auth/logout', function (req, res) {
    req.logOut();
    res.redirect(`/`)
})

// =====================================

app.get('/api/beasts/catalog', (req, res) => res.send(catalogCtrl.catalogCache))
app.get('/api/beasts/:id', getCtrl.getSingleBeast)
app.get('/api/quickview/:hash', getCtrl.getQuickView)
app.get('/api/beasts/player/:id', ctrl.getPlayerBeast)
app.get('/api/auth/me', (req, res) => req.user ? res.send(req.user) : res.send({ id: 0 }))
app.get('/api/canEdit/:id', ctrl.canEditMonster)
app.get('/api/searchName/:name', searchCtrl.searchName)
app.get('/api/getArtist/:id', getCtrl.getArtist)

app.get('/api/search', searchCtrl.search)
app.get('/api/obstacles/search', obstCtrl.search)

app.get('/api/spellsForPleroma', getCtrl.getSpells)

app.get('/api/randomMonster', searchCtrl.getRandomMonster)
app.get('/api/playerCanView/:id', ctrl.checkIfPlayerView)
app.get('/api/favorites', ctrl.getUsersFavorites)
app.get('/api/checkCustomCatalogAccess', (req, res) => req.user && req.user.patreon >=5 ? res.send({canGo: true}) : res.send({color: 'red', message: "You need to increase your Patreon donation to access the custom monster tools"}))

app.get('/api/obstacles/catalog', (req, res) => res.send(obstCtrl.catalogCache))
app.get('/api/obstacles/single/:id', obstCtrl.get)

app.get('/api/encounter/edit/:beastid', ctrl.getEditEncounter)
app.get('/api/encounter/:beastid', ctrl.getRandomEncounter)

app.get('/api/combat/:hash', getCtrl.getQuickView)

app.post('/api/beast/player', ctrl.addPlayerNotes)
app.post('/api/favorite', ctrl.addFavorite)

app.delete('/api/favorite/:beastid', ctrl.deleteFavorite)

function ownerAuth(req, res, next) {
    if (!req.user) {
        checkForContentTypeBeforeSending(res, { color: "red", message: "You need to log on." })
    } else {
        const db = req.app.get('db')
        const id = req.body.id ? req.body.id : req.params.id
        if (id) {
            db.get.can_edit(id).then(result => {
                const canEdit = req.user.id === 1 || req.user.id === 21 || req.user.id === result[0].userid
                if (canEdit) {
                    next()
                } else {
                    checkForContentTypeBeforeSending(res, { color: "red", message: "This isn't your monster" })
                }
            }).catch(e => sendErrorForward('can edit save', e, res))
        } else {
            const canEdit = req.user.id === 1 || req.user.id === 21 || req.user.patreon >= 5
            if (canEdit) {
                next()
            } else {
                checkForContentTypeBeforeSending(res, { color: "red", message: "You need to upgrade your Patreon" })
            }
        }
    }
}

function limitAuth(req, res, next) {
    const db = req.app.get('db')
    db.get.custom_beast_count(req.user.id).then(count => {
        const number = +count[0].count
        const canCreate = req.user.patreon >= 5 && number <= (5 + (req.user.patreon * 2))
        const canEdit = req.user.id === 1 || req.user.id === 21 || canCreate
        if (canEdit) {
            next()
        } else {
            sendErrorForward('add custom monster', { message: "You've hit your limit for monsters. Upgrade your Patreon for more." }, res)
        }
    }).catch(e => sendErrorForward('get custom monster count', e, res))
}

app.get('/api/obstacles/isValid/:name', obstCtrl.isValid)
app.get('/api/equipment', equipmentCtrl.getAllEquipment)
app.get('/api/checkToken/:id', getCtrl.checkToken)
app.get('/api/getAllClimates', getCtrl.getAllClimates)

app.get('/api/customCatalog', catalogCtrl.getCustomCatalog)

app.patch('/api/beasts/edit', ownerAuth, ctrl.editBeast)
app.patch('/api/combatSquare', squareCtrl.getSquare)
app.patch('/api/vitalityAndStress', squareCtrl.setVitalityAndStress)
app.patch('/api/movement', squareCtrl.getMovement)

app.post('/api/beasts/add', ownerAuth, limitAuth, ctrl.addBeast)
app.post('/api/obstacles/add', ownerAuth, obstCtrl.add)
app.post('/api/v1/upload/:id', ownerAuth, uploadMain.array('image', 1), (req, res) =>{ 
    if (!req.file) {
        res.send({message: 'Wrong file type, only upload JPEG and/or PNG', color: 'red'})
    } else {
        res.send({ image: req.file })
    }
});
app.post('/api/v1/uploadToken/:id', ownerAuth, uploadToken.array('image', 1), (req, res) =>{ 
    if (!req.file) {
        res.send({message: 'Wrong file type, only upload JPEG and/or PNG', color: 'red'})
    } else {
        res.send({ image: req.file })
    }
})

app.delete('/api/beasts/delete/:id', ownerAuth, ctrl.deleteBeast)
app.delete('/api/obstacles/:id', ownerAuth, obstCtrl.deleteObstacle)

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../dist/bestiary/index.html'))
})
// ================================== \\

massive(databaseCredentials).then(dbI => {
    app.set('db', dbI)
    app.listen(server, _ => {
        equipmentCtrl.processEquipment()
        catalogCtrl.collectCatalog(app)
        obstCtrl.collectCache(app, 0)
        console.log(`Sing to me a sweet song of forgetfulness and Ill die on your shore ${server}`)
    })
}).catch(e => console.log('DB connection error', e))