const axios = require('axios')
    , { srdEndpoint } = require('./server-config')

let weapons =
    []
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
    getAllEquipment(req, res) {
        res.send({ lists: { weapons, shields, armor }, objects: { weapons: weaponsObj, shields: shieldsObj, armor: armorObj } })
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
    processEquipment() {
        axios.get(srdEndpoint + 'getGroupedWeapons').then(req => {
            req.data.forEach(weaponType => {
                let weaponTypeObj = {
                    label: weaponType.label,
                    items: []
                }
                weaponType.weapons.forEach(weapon => {
                    weaponTypeObj.items.push(`${weapon.name} (${weapon.type})`)
                    weapon.damage = processDamage(weapon.dam, weapon.bonus)
                    weapon.damageObj = getDamageObject(weapon.damage.dice)
                    weaponsObj[`${weapon.name} (${weapon.type})`] = weapon
                    weaponsObj[`${weapon.name}`] = weapon
                })
                weapons.push(weaponTypeObj)
            })
            console.log('weapons done collecting')
        })
        axios.get(srdEndpoint + 'getArmor').then(req => {
            req.data.forEach(armorSet => {
                armorSet.dr = processDR(armorSet.dr)
                if (armorSet.size === 'S') {
                    armor[0].items.push(armorSet.name)
                } else if (armorSet.size === 'M') {
                    armor[1].items.push(armorSet.name)
                } else if (armorSet.size === 'L') {
                    armor[2].items.push(armorSet.name)
                }
                armorObj[armorSet.name] = armorSet
            })
            console.log('armor done collecting')
        })
        axios.get(srdEndpoint + 'getShields').then(req => {
            req.data.forEach(shield => {
                shield.dr = processDR(shield.dr)
                if (shield.size === 'S') {
                    shields[0].items.push(shield.name)
                } else if (shield.size === 'M') {
                    shields[1].items.push(shield.name)
                } else if (shield.size === 'L') {
                    shields[2].items.push(shield.name)
                }
                shieldsObj[shield.name] = shield
            })
            console.log('shields done collecting')
        })
    }
}

function getDamageObject(roleDamage) {
    let diceObject = {
        d3s: 0,
        d4s: 0,
        d6s: 0,
        d8s: 0,
        d10s: 0,
        d12s: 0,
        d20s: 0
    }

    roleDamage.forEach(dice => {
        let index = dice.indexOf("d")
            , substring = dice.substring(index)
        if (substring.includes('20')) {
            if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
                diceObject.d20s += +dice.substring(0, index)
            } else {
                ++diceObject.d20s
            }
        } else if (substring.includes('12')) {
            if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
                diceObject.d12s += +dice.substring(0, index)
            } else {
                ++diceObject.d12s
            }
        } else if (substring.includes('10')) {
            if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
                diceObject.d10s += +dice.substring(0, index)
            } else {
                ++diceObject.d10s
            }
        } else if (substring.includes('8')) {
            if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
                diceObject.d8s += +dice.substring(0, index)
            } else {
                ++diceObject.d8s
            }
        } else if (substring.includes('6')) {
            if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
                diceObject.d6s += +dice.substring(0, index)
            } else {
                ++diceObject.d6s
            }
        } else if (substring.includes('4')) {
            if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
                diceObject.d4s += +dice.substring(0, index)
            } else {
                ++diceObject.d4s
            }
        } else if (substring.includes('3')) {
            if (dice.substring(0, index) !== '' && dice.substring(0, index) != null) {
                diceObject.d3s += +dice.substring(0, index)
            } else {
                ++diceObject.d3s
            }
        }
    })

    return diceObject
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
