let {getSingleBeast} = require('./getController')
let hewy;
let db;
let id;

function rateMonster(monster) {
    let hr = 0
    hr += monster.vitality ? figureOutHealth(calculateAverageOfDice(monster.vitality)) : 0
    if (monster.locationalvitality.length > 0) {
        for (i = 0; i < monster.locationalvitality.length; i++) {
            hr += monster.locationalvitality[i].vitality ? figureOutHealth(calculateAverageOfDice(monster.locationalvitality[i].vitality)) : 0
        }
    }
    hr += monster.panic ? figureOutPanic(monster.panic) : 0
    hr += monster.stress ? figureOutStress(monster.stress) : 0
    hr += monster.combat ? figureOutCombat(monster.combat) : 0
    hr += monster.movement ? figureOutMovement(monster.movement) : 0
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
            + calculateFatigue(hewy.base.fatigue - base.fatigue)
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

function calculateFatigue(fatigue, hFatigue) {
    return convertFatigue(fatigue) + convertFatigue(hFatigue);
}

function convertFatigue(fatigue) {
    switch(fatigue) {
        case "N":
            return 10;
        case "C":
            return 0;
        case "W":
            return -1;
        case "B":
            return -2;
        case "H":
            return -4;
        default:
            return -8;
    }
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
    getSingleBeast(req, res)
}

function updateHewyRating(database, beastid) {
    db = database
    id = beastid
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
