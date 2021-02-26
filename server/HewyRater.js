let controllerObj = require('./controller')
let hewy;
let db;
let id;

function rateMonster(monster) {
    let hr = 0
    hr = hr + figureOutHealth(calculateAverageOfDice(monster.vitality))
    hr = hr + figureOutPanic(monster.panic)
    hr = hr + figureOutStress(monster.stress)
    hr = hr + figureOutCombat(monster.combat)
    hr = hr + figureOutMovement(monster.movement)
    db.update.beastHR(hr, monster.id)
}

function figureOutHealth(vitality) {
    if (!isNaN(vitality)) {
        return +(((vitality / +hewy.vitality) * 10) - 10).toFixed(0)
    } else {
        return 0
    }
}

function figureOutPanic(panic) {
    return (10 - panic) - (10 - hewy.panic)
}

function figureOutStress(stress) {
    if (typeof (stress) !== 'string' || stress.toUpperCase() !== 'N/A') {
        return +(((stress / +hewy.stress) * 10) - 10).toFixed(0)
    } else {
        return 0
    }
}

function figureOutCombat(combat) {
    if (combat.length > 0) {
        let base
            , total = 0;

        combat.forEach(weapon => {
            if (weapon.weapon === "Base") {
                base = weapon
            }
        })
        if (!base) { base = combat[0] }

        total = total
            + (hewy.base.encumb - base.encumb)
            + (base.parry - hewy.base.parry)
            + (calculateAverageOfDice(base.damage) - calculateAverageOfDice(hewy.base.damage))
            + (base.measure - hewy.base.measure)
            + (hewy.base.init - base.init)
            + (base.atk - hewy.base.atk)
            + (hewy.base.spd - base.spd)

        if (!isNaN(+base.def)) {
            total = (+base.def - +hewy.base.def)
        }
        if (base.dr.toUpperCase().includes("/D")) {
            let dr = base.dr.toUpperCase().split('/D')
            dr.forEach((element, index) => {
                element = eval(element)
                if (index === 0) {
                    element * 4
                }
                if (element) {
                    total = total + element
                }
            })
        } else {
            total = (+base.dr - +hewy.base.dr)
        }

        if (base.shield_dr) {
            if (base.shield_dr.toUpperCase().includes("/D")) {
                let dr = base.shield_dr.toUpperCase().split('/D')
                dr.forEach(element => {
                    total = total + (+element / 2)
                })
            } else {
                total = (+base.shield_dr / 2)
            }
        }
        return total
    }
    return 0
}

function figureOutMovement(movements) {
    let move
        , hewyMove = hewy.movement[0]
        , total = 0;
    if (movements.length === 1) {
        move = movements[0]
    } else if (movements.length > 1) {
        movements.forEach(movement => {
            if (movement.type.includes('Land')) {
                move = movement
            }
        })
        if (!move) {
            move = movements[0]
        }
    } else {
        return 0
    }

    total = total + convertMovement(move.stroll, hewyMove.stroll)
    total = total + convertMovement(move.walk, hewyMove.walk)
    total = total + convertMovement(move.jog, hewyMove.jog)
    total = total + convertMovement(move.run, hewyMove.run)
    total = total + convertMovement(move.sprint, hewyMove.sprint)

    return total;
}

function convertMovement(category, hCategory) {
    let hewyCat = +hCategory.split(' ft / sec')[0]
    if (category === 'n/a') {
        return 0
    }
    return +(((+category.split(' ft / sec')[0] / hewyCat) * 10) - 10).toFixed(0)
}

function storeHewy(hewyNew) {
    hewy = hewyNew
    hewy.combat.forEach(weapon => {
        if (weapon.weapon === 'Base') {
            hewy.base = weapon
        }
    })
    prepForSingleBeast(id)
}

function prepForSingleBeast(id) {
    let req = {
        db,
        user: {
            id: 1
        },
        params: {
            id
        },
        query: {}
    }
    let res = {
        send
    }
    function send(monster) {
        if (id === "205") {
            storeHewy(monster)
        } else {
            rateMonster(monster)
        }
    }
    controllerObj.getSingleBeast(req, res)
}

function updateHewyRating(database, newId) {
    db = database
    id = newId
    prepForSingleBeast("205")
}

function calculateAverageOfDice(diceString) {
    let totalValue = 0
    diceString
        .replace(/!| /g, '')
        .split('+')
        .forEach(val => {
            if (val.includes('d')) {
                val = val.split('d')
                val[0] = val[0] ? +val[0] : 1
                totalValue += Math.round((val[0] + (+val[1] * val[0])) / 2)
            } else {
                totalValue += +val
            }
        })
    return totalValue
}

module.exports = {
    updateHewyRating
}
