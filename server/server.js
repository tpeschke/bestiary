const express = require('express')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , massive = require('massive')
    , { server, connection, secret, domain, client_id, client_secret, callback } = require('./server-config')
    , ctrl = require('./controller')
    , searchCtrl = require('./searchController')
    upload = require('./file-upload')
    , session = require('express-session')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0')
    , path = require("path");

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


/////////////////////////////////
//TESTING TOPLEVEL MIDDLEWARE////
///COMMENT OUT WHEN AUTH0 READY///
/////////////////////////////////
app.use((req, res, next) => {
    if (!req.user) {
        req.user = {
            id: 1,
            email: "mr.peschke@gmail.com",
            patreon: 4
        }
    }
    next();
})

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

app.get('/api/beasts/catalog', (req, res) => res.send(ctrl.catalogCache))
app.get('/api/beasts/:id', ctrl.getSingleBeast)
app.get('/api/beasts/player/:id', ctrl.getPlayerBeast)
app.get('/api/auth/me', (req, res) => req.user ? res.send(req.user) : res.send({id: 0}))
app.get('/api/search', searchCtrl.search)

app.post('/api/beast/player', ctrl.addPlayerNotes)

function ownerAuth (req, res, next) {
    if (!req.user) {
        res.sendStatus(401)
    } else if (req.user.id !== 1 && req.user.id !== 21) {
        res.sendStatus(401)
    } else {
        next()
    }
}

app.patch('/api/beasts/edit', ownerAuth, ctrl.editBeast)

app.post('/api/beasts/add', ownerAuth, ctrl.addBeast)
app.post('/api/v1/upload/:id', ownerAuth, upload.array('image', 1), (req, res) => res.send({ image: req.file }));

app.delete('/api/beasts/delete/:id', ownerAuth, ctrl.deleteBeast)

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../dist/bestiary/index.html'))
})
// ================================== \\

massive(connection).then(dbI => {
    app.set('db', dbI)
    app.listen(server, _ => {
        ctrl.collectCache(app, 0)
        console.log(`Sing to me a sweet song of forgetfulness and Ill die on your shore ${server}`)
    })
})