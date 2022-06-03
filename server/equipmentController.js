const axios = require('axios')
    , { srdEndpoint } = require('./server-config')

let weapons =
    [
        {
            label: 'Melee Weapons',
            items: []
        },
        {
            label: 'Ranged Weapons',
            items: []
        },
    ]
    , armor =
        [
            {
                label: 'Light Armor',
                items: []
            },
            {
                label: 'Medium Armor',
                items: []
            },
            {
                label: 'Heavy Armor',
                items: []
            },
        ]
    , shields =
        [
            {
                label: 'Small Shields',
                items: []
            },
            {
                label: 'Medium Shields',
                items: []
            },
            {
                label: 'Large Shields',
                items: []
            },
        ]

let weaponsObj = {}
    , armorObj = {}
    , shieldsObj = {}

module.exports = {
    getEquipmentList(req, res) {
        res.send({ weapons, shields, armor })
    },
    getWeapon(weaponName) {
        return weaponsObj[weaponName]
    },
    getArmor(armorName) {
        return armorObj[armorName]
    },
    getShield(shieldName) {
        return shieldsObj[shieldName]
    },
    getEquipmentObjects(req, res) {
        res.send({weapons: weaponsObj, shields: shieldsObj, armor: armorObj})
    },
    processEquipment() {
        axios.get(srdEndpoint + 'getWeapons').then(req => {
            req.data.forEach(weapon => {
                weapon.damage = processDamage(weapon.dam, weapon.bonus)
                if (weapon.range) {
                    weapons[1].items.push(weapon)
                } else {
                    weapons[0].items.push(weapon)
                }
                weaponsObj[weapon.name] = weapon
            })
            console.log('weapons done collecting')
        })
        axios.get(srdEndpoint + 'getArmor').then(req => {
            req.data.forEach(armorSet => {
                armorSet.dr = processDR(armorSet.dr)
                if (armorSet.size === 'S') {
                    armor[0].items.push(armorSet)
                } else if (armorSet.size === 'M') {
                    armor[1].items.push(armorSet)
                } else if (armorSet.size === 'L') {
                    armor[2].items.push(armorSet)
                }
                armorObj[armorSet.name] = armorSet
            })
            console.log('armor done collecting')
        })
        axios.get(srdEndpoint + 'getShields').then(req => {
            req.data.forEach(shield => {
                shield.dr = processDR(shield.dr)
                if (shield.size === 'S') {
                    shields[0].items.push(shield)
                } else if (shield.size === 'M') {
                    shields[1].items.push(shield)
                } else if (shield.size === 'L') {
                    shields[2].items.push(shield)
                }
                shieldsObj[shield.name] = shield
            })
            console.log('shields done collecting')
        })
    }
}

function processDamage(damageString, bonus) {
    let newDamage = {
        dice: [],
        flat: 0,
        isSpecial: false,
        hasSpecialAndDamage: bonus === 'Yes'
    }

    let expressionValue = ""
    damageString.replace(/\s/g, '').split('').forEach((val, i, array) => {

        if (i === array.length - 1) {
            expressionValue = expressionValue + val
        }
        if (val === '-' || val === '+' || val === '*' || i === array.length - 1) {
            if (expressionValue.includes('d')) {
                newDamage.dice.push(expressionValue)
            } else {
                newDamage.flat += +expressionValue
            }
            expressionValue = ""
        } else {
            expressionValue = expressionValue + val;
        }
    })

    return newDamage
}

function processDR(drString) {
    let newDR = {
        flat: 0,
        slash: 0
    }

    if (drString) {
        drString.split('+').forEach(element => {
            if (element.includes('/d')) {
                newDR.slash = +element.split('/d')[0]
            } else {
                newDR.flat = +element
            }
        })
    }

    return newDR
}
