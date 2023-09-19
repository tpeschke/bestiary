const roles = require('./roles')
const equipmentController = require('./equipmentController')

const noRole = {
    damage: null,
    preferreddamage: 'slashingweapons',
    alldefense: null,
    largeweapons: null,
    rangeddefense: null,
    weaponsmallcrushing: null,
    weaponsmallpiercing: null,
    andslashing: null,
    andcrushing: null,
    weaponsmallslashing: null,
    flanks: null,
    attack: null,
    caution: null,
    fatigue: null,
    initiative: null,
    measure: null,
    panic: null,
    rangedistance: null,
    recovery: null,
    movement: null,
    mental: null
}

const sizeDictionary = {
    Fine: 1,
    Diminutive: 5,
    Tiny: 5,
    Small: 10,
    Medium: 15,
    Large: 20,
    Huge: 35,
    Giant: 55,
    Enormous: 90,
    Colossal: 145
}

const combatSquareController = {
    getSquareDirectly: ({ combatStats, points, size, role }) => {
        const adjustedPoints = +points + combatStats.adjustment
        const weaponType = getWeaponType(combatStats, roles.combatRoles.primary[role])

        let roleInfo = noRole;
        if (role) {
            if (weaponType === 'r') {
                roleInfo = roles.combatRoles.primary[role].rangedCombatStats
            } else {
                roleInfo = roles.combatRoles.primary[role].meleeCombatStats
            }
        }
        const damageAndRecovery = setDamageDice(combatStats, roleInfo, adjustedPoints)
        const initMod = combatStats.armor ? equipmentController.getArmor(combatStats.armor).init : 0

        let combatSquare = {
            weaponType,
            attack: !combatStats.showonlydefenses ? getModifiedStatsRounded('attack', combatStats, roleInfo, adjustedPoints) : '',
            recovery: damageAndRecovery.recovery ? damageAndRecovery.recovery : getRecoveryForSpecial(combatStats, roleInfo, adjustedPoints),
            initiative: !combatStats.showonlydefenses ? getModifiedStatsRounded('initiative', combatStats, roleInfo, adjustedPoints) + initMod : '',
            defense: getDefense(combatStats, roleInfo, adjustedPoints, size),
            cover: getCover(combatStats, roleInfo, adjustedPoints),
            damageType: damageAndRecovery.damageType,
            dr: getBaseDR(combatStats, roleInfo, adjustedPoints),
            shieldDr: getParryDR(combatStats, roleInfo, adjustedPoints),
            measure: !combatStats.showonlydefenses ? getModifiedMeasure(combatStats, roleInfo, adjustedPoints, size) : '',
            range: !combatStats.showonlydefenses ? getModifiedWithWeapon('rangedistance', combatStats, roleInfo, 'range', adjustedPoints) : '',
            damage: damageAndRecovery.damageString,
            parry: getModifiedParry(combatStats, roleInfo, adjustedPoints),
            weaponScaling: damageAndRecovery.weaponScaling,
            flanks: getFlanks(combatStats, roleInfo, adjustedPoints),
            defaultweaponname: getDefaultName(combatStats)
        }

        return combatSquare
    },
    getSquare: (req, res) => {
        res.send(combatSquareController.getSquareDirectly(req.body))
    },
    getMovementDirectly: (movement) => {
        let roleInfo = noRole;
        if (movement.role) {
            roleInfo = roles.combatRoles.primary[movement.role].meleeCombatStats.movement
        }
        const { points } = movement
        let strollspeed = +getMovementStats(movement.strollstrength === 'x' ? null : movement.strollstrength, roleInfo, points + movement.adjustment)
            , walkspeed = +(getMovementStats(movement.walkstrength === 'x' ? null : movement.walkstrength, roleInfo, points + movement.adjustment) + strollspeed)
            , jogspeed = +(getMovementStats(movement.jogstrength === 'x' ? null : movement.jogstrength, roleInfo, points + movement.adjustment) * 2 + walkspeed)
            , runspeed = +(getMovementStats(movement.runstrength === 'x' ? null : movement.runstrength, roleInfo, points + movement.adjustment) * 2 + jogspeed)
            , sprintspeed = +(getMovementStats(movement.sprintstrength === 'x' ? null : movement.sprintstrength, roleInfo, points + movement.adjustment) * 2 + runspeed)

        return { ...movement, movementSpeeds: { strollspeed: returnRoundedMovementOrNullIfX(movement.strollstrength, strollspeed), walkspeed: returnRoundedMovementOrNullIfX(movement.walkstrength, walkspeed), jogspeed: returnRoundedMovementOrNullIfX(movement.jogstrength, jogspeed), runspeed: returnRoundedMovementOrNullIfX(movement.runstrength, runspeed), sprintspeed: returnRoundedMovementOrNullIfX(movement.sprintstrength, sprintspeed) } }
    },
    getMovement: (req, res) => {
        const newMovements = req.body.movements.map(movement => combatSquareController.getMovementDirectly(movement))
        res.send(newMovements)
    },
    setVitalityAndStressDirectly: (points, role, combatStats, secondaryrole, knockback, size, armor, shield) => {
        const baseRoleInfo = role ? roles.combatRoles.primary[role].meleeCombatStats : noRole
        let sizeMod
        if (knockback) {
            sizeMod = +knockback
        } else if (size) {
            sizeMod = sizeDictionary[size]
        } else {
            sizeMod = sizeDictionary.Medium
        }

        let mental = setStressAndPanic(combatStats, baseRoleInfo, points)
        let physical;
        if (combatStats.singledievitality) {
            physical = setVitalityDieAndFatigue(combatStats, baseRoleInfo, points, secondaryrole, armor, shield, sizeMod)
        } else {
            physical = setVitalityAndFatigue(combatStats, baseRoleInfo, points, secondaryrole, armor, shield)
            deteremineVitalityDice(physical, sizeMod, combatStats.noknockback)
        }
        let caution = setCaution(combatStats, baseRoleInfo, points, mental, physical)

        return { mental: { ...mental, caution }, physical: { ...physical } }
    },
    setVitalityAndStress: (req, res) => {
        const { points, role, combatStats, secondaryrole, knockback, size, armor, shield } = req.body
        res.send(combatSquareController.setVitalityAndStressDirectly(points, role, combatStats, secondaryrole, knockback, size, armor, shield))
    },
}

returnRoundedMovementOrNullIfX = (strength, speed) => {
    return strength === 'x' ? null : roundToNearestTwoPointFive(speed)
}

getRecoveryForSpecial = (combatStats, roleInfo, points) => {
    if (combatStats.showonlydefenses) {
        return ''
    }
    return setModifiedRecovery(10, combatStats, roleInfo, points)
}

getDefaultName = ({ weapon, armor, shield }) => {
    if (weapon && weapon.includes('(')) {
        weapon = `${weapon.slice(0, -4)}`
    }

    if (weapon && armor && shield) {
        return `${weapon}, ${armor}, & ${shield}`
    } else if (weapon && armor && !shield) {
        return `${weapon} & ${armor}`
    } else if (weapon && !armor && shield) {
        return `${weapon} & ${shield}`
    } else if (weapon && !armor && !shield) {
        return `${weapon}`
    } else if (!weapon && armor && shield) {
        return `${armor}, & ${shield}`
    } else if (!weapon && armor && !shield) {
        return `${armor}`
    } else if (!weapon && !armor && shield) {
        return `${shield}`
    } else {
        return null
    }
}

setStressAndPanic = (combatStats, baseRoleInfo, combatpoints) => {
    let mental = { stress: 0, panic: 0 }
    mental.stress = getModifiedStats('mental', combatStats, baseRoleInfo, combatpoints)
    let panic;
    if (combatStats.panic === 'one') {
        mental.panic = 1
    } else {
        panic = getModifiedStats('panic', combatStats, baseRoleInfo, combatpoints)
        if (panic > 1) {
            panic = 1.1
        } else if (panic < 0) {
            panic = 0
        }
        if (mental.stress === 'N' || panic === 'N') {
            mental.panic = 'N'
        } else {
            mental.panic = Math.floor(panic * mental.stress)
        }
    }

    return mental
}
setVitalityDieAndFatigue = (combatStats, baseRoleInfo, combatpoints, secondaryrole, armor, shield, sizeMod) => {
    let physical = {}
    const scaling = getStatScaling('singleDieVitality')
    let numberOfIncreases = Math.floor(getModifiedStat(combatStats.largeweapons ? combatStats.largeweapons : baseRoleInfo.largeweapons, scaling, combatpoints))

    if (!isNaN(numberOfIncreases)) {
        if (secondaryrole) {
            if (secondaryrole === 'Fodder') {
                numberOfIncreases = Math.floor(numberOfIncreases / 2)
            } else if (secondaryrole === 'Solo') {
                numberOfIncreases *= 3
            }
        }

        let diceObject = {
            d3s: 0,
            d4s: 0,
            d6s: 0,
            d8s: 0,
            d10s: 0,
            d12s: 0,
            d20s: 0,
        }

        diceObject.d20s += Math.floor(numberOfIncreases / 6)
        let leftover = numberOfIncreases % 6
        if (leftover === 1) {
            diceObject.d4s += 1
        } else if (leftover === 2) {
            diceObject.d6s += 1
        } else if (leftover === 3) {
            diceObject.d8s += 1
        } else if (leftover === 4) {
            diceObject.d10s += 1
        } else if (leftover === 5) {
            diceObject.d12s += 1
        }

        let { d4s, d6s, d8s, d10s, d12s, d20s } = diceObject
        let diceString = ''
        let average = 0

        if (d4s > 0) {
            diceString += ` ${diceString !== '' ? '+' : ''}${d4s}d4!`
            average += (2 * d4s)
        }
        if (d6s > 0) {
            diceString += ` ${diceString !== '' ? '+' : ''}${d6s}d6!`
            average += (3 * d6s)
        }
        if (d8s > 0) {
            diceString += ` ${diceString !== '' ? '+' : ''}${d8s}d8!`
            average += (4 * d8s)
        }
        if (d10s > 0) {
            diceString += ` ${diceString !== '' ? '+' : ''}${d10s}d10!`
            average += (5 * d10s)
        }
        if (d12s > 0) {
            diceString += ` ${diceString !== '' ? '+' : ''}${d12s}d12!`
            average += (6 * d12s)
        }
        if (d20s > 0) {
            diceString += ` ${diceString !== '' ? '+' : ''}${d20s}d20!`
            average += (10 * d20s)
        }

        physical.largeweapons = average
        let knockbackString = ''
        if (!combatStats.noknockback) {
            knockbackString = ` (KB: ${sizeMod})`
        }
        physical.diceString = `${diceString}${knockbackString}`
    } else {
        physical.largeweapons = 'N'
        physical.diceString = !combatStats.noknockback ? `(KB: ${sizeMod})` : null
    }

    physical.fatigue = getFatigue(combatStats, baseRoleInfo, combatpoints, armor, shield, physical.largeweapons)
    return physical

}
setVitalityAndFatigue = (combatStats, baseRoleInfo, combatpoints, secondaryrole, armor, shield) => {
    let physical = {}
    physical.largeweapons = getModifiedStats('largeweapons', combatStats, baseRoleInfo, combatpoints)
    if (secondaryrole && physical.largeweapons !== 'N') {
        if (secondaryrole === 'Fodder' && physical.largeweapons !== 1) {
            physical.largeweapons = Math.floor(physical.largeweapons / 2)
        } else if (secondaryrole === 'Solo') {
            physical.largeweapons *= 3
        }
    }
    physical.fatigue = getFatigue(combatStats, baseRoleInfo, combatpoints, armor, shield, physical.largeweapons)
    return physical
}
getFatigue = (combatStats, baseRoleInfo, combatpoints, armor, shield, largeweapons) => {
    if (combatStats.fatigue === 'one') {
        return 1
    }
    let fatigue = getModifiedStats('fatigue', combatStats, baseRoleInfo, combatpoints)
    if (fatigue !== 'N' && largeweapons !== 'N') {
        if (armor) {
            fatigue += (equipmentController.getArmor(armor).fatigue * -.25)
        }
        if (shield) {
            fatigue += (equipmentController.getShield(shield).fatigue * -.25)
        }
        if (fatigue > 1) {
            fatigue = 1
        }
        return Math.floor(fatigue * largeweapons)
    } else if (largeweapons === 'N' || fatigue === 'N') {
        return 'N'
    } else {
        return fatigue
    }
}
setCaution = (combatStats, baseRoleInfo, combatpoints, mental, physical) => {
    if (combatStats.caution === 'one') {
        return 1
    }
    let caution = getModifiedStats('caution', combatStats, baseRoleInfo, combatpoints)
    if (caution === 'N') {
        return caution
    }
    if (caution > 1) {
        caution = 1
    }
    const largeweapons = physical.largeweapons === 'N' ? 0 : physical.largeweapons
    const stress = mental.stress === 'N' ? 0 : mental.stress
    return Math.floor((stress + largeweapons) * caution)
}
deteremineVitalityDice = (physical, sizeMod, noknockback) => {
    if (physical.largeweapons - sizeMod > 0) {
        const remainder = roundToNearestEvenNumber(physical.largeweapons - sizeMod)
        if (remainder % 10 === 0) {
            if (remainder / 10 > 1) {
                physical.diceString = `(d20 * ${remainder / 10}) + ${sizeMod}`
            } else {
                physical.diceString = `d20 + ${sizeMod}`
            }
        } else if (remainder % 6 === 0) {
            if (remainder / 6 > 1) {
                physical.diceString = `(d12 * ${remainder / 6}) + ${sizeMod}`
            } else {
                physical.diceString = `d12 + ${sizeMod}`
            }
        } else if (remainder % 5 === 0) {
            if (remainder / 5 > 1) {
                physical.diceString = `(d10 * ${remainder / 5}) + ${sizeMod}`
            } else {
                physical.diceString = `d10 + ${sizeMod}`
            }
        } else if (remainder % 4 === 0) {
            if (remainder / 4 > 1) {
                physical.diceString = `(d8 * ${remainder / 4}) + ${sizeMod}`
            } else {
                physical.diceString = `d8 + ${sizeMod}`
            }
        } else if (remainder % 3 === 0) {
            if (remainder / 3 > 1) {
                physical.diceString = `(d6 * ${remainder / 3}) + ${sizeMod}`
            } else {
                physical.diceString = `d6 + ${sizeMod}`
            }
        } else if (remainder % 2 === 0) {
            if (remainder / 2 > 1) {
                physical.diceString = `(d4 * ${remainder / 2}) + ${sizeMod}`
            } else {
                physical.diceString = `d4 + ${sizeMod}`
            }
        } else {
            physical.diceString = `${physical.largeweapons - sizeMod} + ${sizeMod}`
        }
    } else if (physical.largeweapons === 'N') {
        physical.diceString = !noknockback ? `(KB: ${sizeMod})` : null
    } else if (physical.largeweapons === 1) {
        let knockbackString = ''
        if (!noknockback) {
            knockbackString = ` (KB: ${sizeMod})`
        }
        physical.diceString = `1${knockbackString}`
    } else {
        physical.largeweapons = sizeMod
        if (!noknockback) {
            physical.diceString = `0 + ${sizeMod}`
        } else {
            physical.diceSize = `${sizeMod}`
        }
    }
    return 'Something went wrong'
}

getStatScaling = function (stat) {
    return scalingAndBases[stat]
}

getModifiedStats = function (stat, combatStats, roleInfo, points) {
    let scalingStrength;
    if (combatStats[stat]) {
        scalingStrength = combatStats[stat]
    } else {
        scalingStrength = roleInfo[stat]
    }
    const scaling = scalingAndBases[stat]
    const modifiedStat = getModifiedStat(scalingStrength, scaling, points)
    return modifiedStat
}

getModifiedWithWeapon = (combatStatKey, combatStats, roleInfo, weaponKey, points) => {
    let scalingStrength;
    let modifiedStat;

    if (combatStats[combatStatKey]) {
        scalingStrength = combatStats[combatStatKey]
    } else {
        scalingStrength = roleInfo[combatStatKey]
    }

    const scaling = scalingAndBases[combatStatKey]

    if (combatStats.weapon) {
        const equipmentStat = equipmentController.getWeapon(combatStats.weapon)[weaponKey]
        if (scalingStrength === 'noneStr') {
            modifiedStat = equipmentStat - (scaling.scaling.none - scaling.scaling.minWk)
        } else if (scalingStrength === 'noneWk') {
            modifiedStat = equipmentStat - (scaling.scaling.none - scaling.scaling.majWk)
        } else if (scalingStrength === 'none' || !scalingStrength) {
            modifiedStat = equipmentStat
        } else {
            modifiedStat = equipmentStat + (scaling.bonus[scalingStrength] * points)
        }
    } else {
        modifiedStat = getModifiedStat(scalingStrength, scaling, points)
    }

    if (modifiedStat > 0) {
        return Math.floor(modifiedStat)
    }
    return 0
}

getArmorOrShieldStat = (stat, ArmorOrShield, weaponKey, combatStats, roleInfo, points) => {
    let scalingStrength;
    let modifiedStat;

    if (combatStats[stat]) {
        scalingStrength = combatStats[stat]
    } else {
        scalingStrength = roleInfo[stat]
    }

    const scaling = getStatScaling(stat)

    let equipmentStat
    if (ArmorOrShield === 'armor') {
        equipmentStat = equipmentController.getArmor(combatStats[ArmorOrShield]).dr[weaponKey]
    } else {
        equipmentStat = equipmentController.getShield(combatStats[ArmorOrShield]).dr[weaponKey]
    }

    if (scalingStrength === 'noneStr') {
        modifiedStat = equipmentStat - (scaling.scaling.none - scaling.scaling.minWk)
    } else if (scalingStrength === 'noneWk') {
        modifiedStat = equipmentStat - (scaling.none - scaling.scaling.majWk)
    } else if (scalingStrength === 'none' || !scalingStrength) {
        modifiedStat = equipmentStat
    } else {
        modifiedStat = equipmentStat + (scaling.bonus[scalingStrength] * points)
    }

    return modifiedStat
}

getModifiedStat = (scalingStrength, scaling, points) => {
    if (scalingStrength === 'x') {
        return 'N'
    } else if (scalingStrength === 'one') {
        return 1
    } else if (scalingStrength === 'noneStr') {
        return scaling.scaling.majSt
    } else if (scalingStrength === 'noneWk') {
        return scaling.scaling.majWk
    } else if (scalingStrength === 'none' || !scalingStrength) {
        return scaling.scaling.none
    } else {
        return scaling.scaling[scalingStrength] + (scaling.bonus[scalingStrength] * points)
    }
}

getMovementStats = function (movementScale, roleInfo, points) {
    let scalingStrength;
    if (movementScale) {
        scalingStrength = movementScale
    } else {
        scalingStrength = roleInfo
    }

    const scaling = scalingAndBases.movement
    const modifiedStat = getModifiedStat(scalingStrength, scaling, points)

    return modifiedStat
}

roundToNearestTwoPointFive = (x) => {
    return Math.ceil(x / 2.5) * 2.5
}

roundToNearestEvenNumber = (x) => {
    return Math.round(x / 2) * 2
}

getModifiedStatsRounded = function (stat, combatStats, roleInfo, points) {
    return Math.floor(getModifiedStats(stat, combatStats, roleInfo, points))
}

getModifiedStatsMinZero = function (stat, combatStats, roleInfo, points) {
    const modifiedStat = getModifiedStats(stat, combatStats, roleInfo, points)
    if (modifiedStat > 0) {
        return modifiedStat
    }
    return 0
}

getDamageScalingInfo = function (damageType) {
    if (damageType === 'C') {
        return scalingAndBases.crushingweapons
    } else if (damageType === 'P') {
        return scalingAndBases.piercingweapons
    } else if (damageType === 'S') {
        return scalingAndBases.slashingweapons
    }
}

getRecoveryFromDiceSize = function (diceSize) {
    return scalingAndBases.recovery.base[diceSize]
}

getFlanks = (combatStats, roleInfo, points) => {
    let scalingStrength;
    let modifiedStat;

    if (combatStats.flanks) {
        scalingStrength = combatStats.flanks
    } else {
        scalingStrength = roleInfo.flanks
    }

    const scaling = getStatScaling('flanks')

    if (combatStats.shield) {
        const shieldFlanks = equipmentController.getShield(combatStats.shield).flanks
        if (scalingStrength === 'noneStr') {
            modifiedStat = shieldFlanks - (scaling.scaling.none - scaling.scaling.minWk)
        } else if (scalingStrength === 'noneWk') {
            modifiedStat = shieldFlanks - (scaling.scaling.none - scaling.scaling.majWk)
        } else if (scalingStrength === 'none' || !scalingStrength) {
            modifiedStat = shieldFlanks
        } else {
            modifiedStat = shieldFlanks + (scaling.bonus[scalingStrength] * points)
        }
    } else {
        modifiedStat = getModifiedStat(scalingStrength, scaling, points)
    }
    if (modifiedStat >= 1) {
        return Math.floor(modifiedStat)
    }
    return 1
}

getModifiedMeasure = (combatStats, roleInfo, points, size) => {
    let scalingStrength;
    let modifiedStat;

    if (combatStats.measure) {
        scalingStrength = combatStats.measure
    } else {
        scalingStrength = roleInfo.measure
    }

    const scaling = getStatScaling('measure')

    if (!combatStats.swarmbonus) {
        if (combatStats.weapon) {
            const weaponMeasure = equipmentController.getWeapon(combatStats.weapon).measure
            if (scalingStrength === 'noneStr') {
                modifiedStat = weaponMeasure - (scaling.scaling.none - scaling.scaling.minWk)
            } else if (scalingStrength === 'noneWk') {
                modifiedStat = weaponMeasure - (scaling.scaling.none - scaling.scaling.majWk)
            } else if (scalingStrength === 'none' || !scalingStrength) {
                modifiedStat = weaponMeasure
            } else {
                modifiedStat = weaponMeasure + (scaling.bonus[scalingStrength] * points)
            }
        } else {
            modifiedStat = getModifiedStat(scalingStrength, scaling, points)
        }

        const measureModDictionary = {
            Fine: -4,
            Diminutive: -3,
            Tiny: -2,
            Small: -1,
            Medium: 0,
            Large: 1,
            Huge: 2,
            Giant: 3,
            Enormous: 4,
            Colossal: 5
        }

        if (!combatStats.addsizemod) {
            return modifiedStat
        }
        return Math.floor(modifiedStat + measureModDictionary[size])

    } else {
        if (scalingStrength === 'x') {
            return 'N'
        } else if (scalingStrength === 'noneStr') {
            return scaling.swarm.majSt
        } else if (scalingStrength === 'noneWk') {
            return scaling.swarm.majWk
        } else if (scalingStrength === 'none' || !scalingStrength) {
            return scaling.swarm.none
        } else {
            return scaling.swarm[scalingStrength]
        }
    }
}

getModifiedParry = (combatStats, roleInfo, points) => {
    if (combatStats.eua) {
        return 'EUA'
    }
    let scalingStrength;

    if (combatStats.weaponsmallpiercing) {
        scalingStrength = combatStats.weaponsmallpiercing
    } else {
        scalingStrength = roleInfo.weaponsmallpiercing
    }

    const scaling = getStatScaling('weaponsmallpiercing')
    let modifiedParry = null;
    let baseParry = null;
    if (combatStats.shield) {
        baseParry = equipmentController.getShield(combatStats.shield).parry
    } else if (combatStats.weapon) {
        baseParry = equipmentController.getWeapon(combatStats.weapon).parry
    }
    if (!baseParry || baseParry === 0) {
        if (scalingStrength === 'noneStr') {
            modifiedParry = scaling.scaling.majSt
        } else if (scalingStrength === 'noneWk') {
            modifiedParry = scaling.scaling.majWk
        } else if (scalingStrength === 'none') {
            modifiedParry = scaling.scaling.none
        } else {
            modifiedParry = Math.ceil(scaling.scaling[scalingStrength] + (scaling.bonus[scalingStrength] * points))
        }
    } else {
        if (scalingStrength === 'noneStr') {
            modifiedParry = Math.ceil(baseParry - (scaling.scaling.none - scaling.scaling.minWk))
        } else if (scalingStrength === 'noneWk') {
            modifiedParry = Math.ceil(baseParry - (scaling.scaling.none - scaling.scaling.majWk))
        } else if (scalingStrength === 'none') {
            modifiedParry = Math.ceil(baseParry - scaling.scaling.none)
        } else {
            modifiedParry = Math.ceil(baseParry + (scaling.bonus[scalingStrength] * points))
        }
    }

    if (modifiedParry < 0) {
        return 0
    }
    return modifiedParry

}

getDefense = (combatStats, roleInfo, points, size) => {
    const modifiedStat = getModifiedStatsRounded('alldefense', combatStats, roleInfo, points)

    const defenseModDictionary = {
        Fine: 12,
        Diminutive: 9,
        Tiny: 6,
        Small: 3,
        Medium: 0,
        Large: -3,
        Huge: -6,
        Giant: -9,
        Enormous: -12,
        Colossal: -15
    }

    let equipmentMod = 0
    if (combatStats.armor) {
        equipmentMod += equipmentController.getArmor(combatStats.armor).def
    }
    if (combatStats.shield) {
        equipmentMod += equipmentController.getShield(combatStats.shield).def
    }

    if (!combatStats.addsizemod) {
        return modifiedStat + equipmentMod
    }

    return modifiedStat + defenseModDictionary[size] + equipmentMod
}

setDamageDice = (combatStats, roleInfo, points) => {
    if (combatStats.weapon) {
        return setWeaponDamage(combatStats, roleInfo, points)
    } else {
        return setNoWeaponDamage(combatStats, roleInfo, points)
    }
}

getWeaponScalingStrength = (combatStats, roleInfo) => {
    if (combatStats.piercingweapons) {
        return combatStats.piercingweapons
    } else if (combatStats.crushingweapons) {
        return combatStats.crushingweapons
    } else if (combatStats.slashingweapons) {
        return combatStats.slashingweapons
    } else if (roleInfo.damage) {
        return roleInfo.damage
    } else {
        return null
    }
}

setWeaponDamage = (combatStats, roleInfo, points) => {
    if (combatStats.isspecial === 'yes') {
        damageString = '*'
        return false
    }

    if (combatStats.showonlydefenses) {
        damageString = ''
        return false
    }

    let scalingStrength = getWeaponScalingStrength(combatStats, roleInfo)

    damageType = equipmentController.getWeapon(combatStats.weapon).type

    const scaling = getStatScaling('weapon')

    let modifiedPoints = getModifiedStat(scalingStrength, scaling, points)

    if (modifiedPoints < 0) {
        modifiedPoints = 1
    }

    let crushingDamageMod = 0
    let diceObject = { ...equipmentController.getWeapon(combatStats.weapon).damageObj }

    if (damageType === 'S') {
        diceObject.d4s += Math.floor(modifiedPoints / 2)
        let leftover = modifiedPoints % 2
        if (leftover === 1) {
            diceObject.d3s += 1
        }
    } else if (damageType === 'P') {
        diceObject.d8s += Math.floor(modifiedPoints / 4)
        let leftover = modifiedPoints % 4
        if (leftover === 1) {
            diceObject.d3s += 1
        } else if (leftover === 2) {
            diceObject.d4s += 1
        } else if (leftover === 3) {
            diceObject.d6s += 1
        }
    } else {
        crushingDamageMod = modifiedPoints
    }

    let { d3s, d4s, d6s, d8s, d10s, d12s, d20s } = diceObject

    let diceString = ''

    if (d3s > 0) {
        diceString += `${d3s}d3!`
    }
    if (d4s > 0) {
        diceString += ` ${diceString !== '' ? '+' : ''}${d4s}d4!`
    }
    if (d6s > 0) {
        diceString += ` ${diceString !== '' ? '+' : ''}${d6s}d6!`
    }
    if (d8s > 0) {
        diceString += ` ${diceString !== '' ? '+' : ''}${d8s}d8!`
    }
    if (d10s > 0) {
        diceString += ` ${diceString !== '' ? '+' : ''}${d10s}d10!`
    }
    if (d12s > 0) {
        diceString += ` ${diceString !== '' ? '+' : ''}${d12s}d12!`
    }
    if (d20s > 0) {
        diceString += ` ${diceString !== '' ? '+' : ''}${d20s}d20!`
    }

    if (crushingDamageMod) {
        diceString += ` +${Math.ceil(crushingDamageMod)}`
    }

    baseRecovery = 0
    if (combatStats.weapon) {
        baseRecovery += equipmentController.getWeapon(combatStats.weapon).rec
    }
    if (combatStats.armor) {
        baseRecovery += equipmentController.getArmor(combatStats.armor).rec
    }
    const recovery = setModifiedRecovery(baseRecovery, combatStats, roleInfo, points)

    if (combatStats.isspecial === 'kinda') {
        diceString += '*'
    }

    damageString = diceString

    return { damageString, recovery, damageType, weaponScaling: scalingStrength }
}

setNoWeaponDamage = (combatStats, roleInfo, points) => {
    if (combatStats.isspecial === 'yes') {
        damageString = '*'
        return false
    }
    if (combatStats.showonlydefenses) {
        damageString = ''
        return false
    }

    let scalingStrength;
    if (combatStats.piercingweapons) {
        scalingStrength = combatStats.piercingweapons
        damageType = 'P'
    } else if (combatStats.crushingweapons) {
        scalingStrength = combatStats.crushingweapons
        damageType = 'C'
    } else if (combatStats.slashingweapons) {
        scalingStrength = combatStats.slashingweapons
        damageType = 'S'
    } else {
        scalingStrength = roleInfo.damage
        if (roleInfo.preferreddamage === 'piercingweapons') {
            damageType = 'P'
        } else if (roleInfo.preferreddamage === 'crushingweapons') {
            damageType = 'C'
        } else if (roleInfo.preferreddamage === 'slashingweapons') {
            damageType = 'S'
        } else {
            scalingStrength = null
            damageType = ''
        }
    }

    const scaling = getDamageScalingInfo(damageType);

    let modifiedPoints = getModifiedStat(scalingStrength, scaling, points)
    if (modifiedPoints <= 0) {
        modifiedPoints = 1
    }

    let crushingDamageMod = 0
    let diceObject = {
        d3s: 0,
        d4s: 0,
        d6s: 0,
        d8s: 0,
        d10s: 0,
        d12s: 0,
        d20s: 0,
    }

    if (damageType === 'S') {
        diceObject.d4s += Math.floor(modifiedPoints / 2)
        let leftover = modifiedPoints % 2
        if (leftover === 1) {
            diceObject.d3s += 1
        }
    } else if (damageType === 'P') {
        diceObject.d8s += Math.floor(modifiedPoints / 4)
        let leftover = modifiedPoints % 4
        if (leftover === 1) {
            diceObject.d3s += 1
        } else if (leftover === 2) {
            diceObject.d4s += 1
        } else if (leftover === 3) {
            diceObject.d6s += 1
        }
    } else {
        if (modifiedPoints < 2) {
            diceObject.d4s += 1
        } else if (modifiedPoints < 3) {
            diceObject.d6s += 1
        } else if (modifiedPoints < 4) {
            diceObject.d8s += 1
        } else if (modifiedPoints < 5) {
            diceObject.d10s += 1
        } else if (modifiedPoints < 6) {
            diceObject.d12s += 1
        } else {
            diceObject.d20s += 1
            crushingDamageMod = Math.floor(modifiedPoints) - 6
        }
    }

    let { d3s, d4s, d6s, d8s, d10s, d12s, d20s } = diceObject

    let diceString = ''
    let baseRecovery = combatStats.armor ? equipmentController.getArmor(combatStats.armor).rec : 0

    if (d3s > 0) {
        diceString += `${d3s}d3!`
        baseRecovery += d3s * getRecoveryFromDiceSize('d3')
    }
    if (d4s > 0) {
        diceString += ` ${diceString !== '' ? '+' : ''}${d4s}d4!`
        baseRecovery += d4s * getRecoveryFromDiceSize('d4')
    }
    if (d6s > 0) {
        diceString += ` ${diceString !== '' ? '+' : ''}${d6s}d6!`
        baseRecovery += d6s * getRecoveryFromDiceSize('d6')
    }
    if (d8s > 0) {
        diceString += ` ${diceString !== '' ? '+' : ''}${d8s}d8!`
        baseRecovery += d8s * getRecoveryFromDiceSize('d8')
    }
    if (d10s > 0) {
        diceString += ` ${diceString !== '' ? '+' : ''}${d10s}d10!`
        baseRecovery += d10s * getRecoveryFromDiceSize('d10')
    }
    if (d12s > 0) {
        diceString += ` ${diceString !== '' ? '+' : ''}${d12s}d12!`
        baseRecovery += d12s * getRecoveryFromDiceSize('d12')
    }
    if (d20s > 0) {
        diceString += ` ${diceString !== '' ? '+' : ''}${d20s}d20!`
        baseRecovery += d20s * getRecoveryFromDiceSize('d20')
    }

    if (crushingDamageMod) {
        diceString += ` +${crushingDamageMod}`
    }

    const recovery = setModifiedRecovery(baseRecovery, combatStats, roleInfo, points)

    if (combatStats.isspecial === 'kinda') {
        diceString += '*'
    }

    damageString = diceString

    return { damageString, recovery, damageType }
}

setModifiedRecovery = (baseRecovery, combatStats, roleInfo, points) => {
    if (!combatStats.swarmbonus) {
        let scalingStrength;

        if (combatStats.recovery) {
            scalingStrength = combatStats.recovery
        } else {
            scalingStrength = roleInfo.recovery
        }

        const scaling = getStatScaling('recovery')
        let unadjustedRecovery = 0
        if (scalingStrength === 'noneStr') {
            unadjustedRecovery = Math.ceil(baseRecovery * scaling.scaling.minWk)
        } else if (scalingStrength === 'noneWk') {
            unadjustedRecovery = Math.ceil(baseRecovery * scaling.scaling.majWk)
        } else if (scalingStrength === 'none') {
            unadjustedRecovery = Math.ceil(baseRecovery * scaling.scaling.none)
        } else {
            unadjustedRecovery = Math.ceil((scaling.scaling[scalingStrength] * baseRecovery) - (scaling.bonus[scalingStrength] * points))
        }

        if (unadjustedRecovery <= 10) {
            unadjustedRecovery = unadjustedRecovery
        } else if (unadjustedRecovery <= 20) {
            unadjustedRecovery = unadjustedRecovery - 2
        } else if (unadjustedRecovery <= 30) {
            unadjustedRecovery = unadjustedRecovery - 5
        } else if (unadjustedRecovery <= 40) {
            unadjustedRecovery = unadjustedRecovery - 10
        } else {
            unadjustedRecovery = unadjustedRecovery - (Math.ceil((unadjustedRecovery - 40) / 10) * 5)
        }

        if (combatStats.weapon) {
            const weaponInfo = equipmentController.getWeapon(combatStats.weapon)
            const minSpeed = minSpeedDictionary[weaponInfo.type][weaponInfo.size]
            if (unadjustedRecovery < minSpeed) {
                return minSpeed
            }
            return unadjustedRecovery
        } else {
            if (unadjustedRecovery < 2) {
                return 2
            }
            return unadjustedRecovery
        }
    } else {
        const scaling = getStatScaling('recovery')
        const scalingStrength = combatStats.recovery
        if (scalingStrength === 'x') {
            return 'N'
        } else if (scalingStrength === 'noneStr') {
            return scaling.swarm.majSt
        } else if (scalingStrength === 'noneWk') {
            return scaling.swarm.majWk
        } else if (scalingStrength === 'none' || !scalingStrength) {
            return scaling.swarm.none
        } else {
            return scaling.swarm[scalingStrength]
        }
    }
}

getCover = (combatStats, roleInfo, points) => {
    let scalingStrength;

    if (combatStats.rangeddefense) {
        scalingStrength = combatStats.rangeddefense
    } else {
        scalingStrength = roleInfo.rangeddefense
    }

    const scaling = getStatScaling('rangeddefense')
    let modifiedCover = null;
    let baseCover = null;
    let crouchingCover = null

    if (combatStats.shield) {
        let coverString = equipmentController.getShield(combatStats.shield).cover.slice(1)
        coverString = coverString.slice(0, coverString.length - 1).split(' (+')
        baseCover = +coverString[0]
        crouchingCover = +coverString[1]
    }
    if (!baseCover || baseCover === 0) {
        if (scalingStrength === 'noneStr') {
            modifiedCover = scaling.scaling.majSt
        } else if (scalingStrength === 'noneWk') {
            modifiedCover = scaling.scaling.majWk
        } else if (scalingStrength === 'none') {
            modifiedCover = scaling.scaling.none
        } else {
            modifiedCover = Math.ceil(scaling.scaling[scalingStrength] + (scaling.bonus[scalingStrength] * points))
        }
    } else {
        if (scalingStrength === 'noneStr') {
            modifiedCover = Math.ceil(baseCover + (scaling.scaling.none - scaling.scaling.minSt))
            if (crouchingCover) {
                crouchingCover = Math.ceil(crouchingCover + (scaling.scaling.none - scaling.scaling.minSt))
            }
        } else if (scalingStrength === 'noneWk') {
            modifiedCover = Math.ceil(baseCover + (scaling.scaling.none - scaling.scaling.majWk))
            if (crouchingCover) {
                crouchingCover = Math.ceil(crouchingCover + (scaling.scaling.none - scaling.scaling.majWk))
            }
        } else if (scalingStrength === 'none') {
            modifiedCover = Math.ceil(baseCover + scaling.scaling.none)
            if (crouchingCover) {
                crouchingCover = Math.ceil(crouchingCover + scaling.scaling.none)
            }
        } else {
            modifiedCover = Math.ceil(baseCover + (scaling.bonus[scalingStrength] * points))
            if (crouchingCover) {
                crouchingCover = Math.ceil(crouchingCover + (scaling.bonus[scalingStrength] * points))
            }
        }
    }

    if (modifiedCover > 0) {
        const crouchedCover = crouchingCover ? crouchingCover : modifiedCover * 1.5

        if (crouchedCover >= 20) {
            return `+${Math.floor(modifiedCover)}(*)`
        } else {
            return `+${Math.floor(modifiedCover)}(+${Math.floor(crouchedCover)})`
        }
    } else {
        return '+0'
    }
}

getBaseDR = (combatStats, roleInfo, points) => {
    if (combatStats.armor) {
        const armorSlash = Math.floor(getArmorOrShieldStat('weaponsmallslashing', 'armor', 'slash', combatStats, roleInfo, points))
        const armorStatic = Math.floor(getArmorOrShieldStat('weaponsmallcrushing', 'armor', 'flat', combatStats, roleInfo, points))

        return getDRString(armorSlash, armorStatic)
    }
    const slashDR = getModifiedStatsRounded('weaponsmallslashing', combatStats, roleInfo, points)
    const staticDR = getModifiedStatsRounded('weaponsmallcrushing', combatStats, roleInfo, points)

    return getDRString(slashDR, staticDR)
}

getParryDR = (combatStats, roleInfo, points) => {
    if (combatStats.shield) {
        const shieldSlash = Math.floor(getArmorOrShieldStat('andslashing', 'shield', 'slash', combatStats, roleInfo, points))
        const shieldStatic = Math.floor(getArmorOrShieldStat('andcrushing', 'shield', 'flat', combatStats, roleInfo, points))

        return getDRString(shieldSlash, shieldStatic)
    }

    const slashDR = getModifiedStatsRounded('andslashing', combatStats, roleInfo, points)
    const staticDR = getModifiedStatsRounded('andcrushing', combatStats, roleInfo, points)

    return getDRString(slashDR, staticDR)
}

getDRString = (slashDR, staticDR) => {
    if (slashDR > 0 && staticDR > 0) {
        return `${Math.floor(slashDR)}/d +${Math.floor(staticDR)}`
    } else if (Math.floor(slashDR) > 0) {
        return `${Math.floor(slashDR)}/d`
    } else if (Math.floor(staticDR) > 0) {
        return `${Math.floor(staticDR)}`
    } else {
        return 0
    }
}

getWeaponType = (combatStats, roleInfo) => {
    if (combatStats.weapon) {
        return equipmentController.getWeapon(combatStats.weapon).range ? 'r' : 'm'
    }
    if (combatStats.weapontype) {
        return combatStats.weapontype
    }
    if (roleInfo) {
        return roleInfo.weapontype
    }
    return 'm'
}

const minSpeedDictionary = {
    P: {
        S: 2,
        M: 2,
        L: 2
    },
    S: {
        S: 3,
        M: 4,
        L: 5
    },
    C: {
        S: 4,
        M: 5,
        L: 6
    }
}

const scalingAndBases = {
    piercingweapons: {
        scaling: {
            majSt: 6,
            minSt: 5,
            none: 4,
            minWk: 3,
            majWk: 2
        },
        bonus: {
            majSt: 1.5,
            minSt: 1.25,
            none: 0,
            minWk: .5,
            majWk: .25
        }
    },
    slashingweapons: {
        scaling: {
            majSt: 5,
            minSt: 4,
            none: 3,
            minWk: 2,
            majWk: 1
        },
        bonus: {
            majSt: 1.5,
            minSt: 1.25,
            none: 0,
            minWk: .5,
            majWk: .25
        }
    },
    crushingweapons: {
        scaling: {
            majSt: 5,
            minSt: 4,
            none: 3,
            minWk: 2,
            majWk: 1
        },
        bonus: {
            majSt: 1.5,
            minSt: 1.25,
            none: 0,
            minWk: .5,
            majWk: .25
        }
    },
    weapon: {
        scaling: {
            majSt: 2,
            minSt: 1,
            none: 0,
            minWk: -1,
            majWk: -2
        },
        bonus: {
            majSt: 1.5,
            minSt: 1.25,
            none: 0,
            minWk: .5,
            majWk: .25
        }
    },
    alldefense: {
        scaling: {
            majSt: 3,
            minSt: 2,
            none: 0,
            minWk: -2,
            majWk: -4
        },
        bonus: {
            majSt: 1.1,
            minSt: 1.05,
            none: 0,
            minWk: 1,
            majWk: .9
        }
    },
    singleDieVitality: {
        scaling: {
            majSt: 5,
            minSt: 4,
            none: 3,
            minWk: 2,
            majWk: 1
        },
        bonus: {
            majSt: 1.5,
            minSt: 1,
            none: 0,
            minWk: .5,
            majWk: .25
        }
    },
    largeweapons: {
        scaling: {
            majSt: 50,
            minSt: 35,
            none: 25,
            minWk: 20,
            majWk: 15
        },
        bonus: {
            majSt: 15,
            minSt: 10,
            none: 0,
            minWk: 5,
            majWk: 1
        }
    },
    rangeddefense: {
        scaling: {
            majSt: 6,
            minSt: 3,
            none: 0,
            minWk: -3,
            majWk: -6
        },
        bonus: {
            majSt: 3,
            minSt: 2,
            none: 0,
            minWk: 1,
            majWk: .75
        }
    },
    weaponsmallcrushing: {
        scaling: {
            majSt: 3,
            minSt: 2,
            none: 0,
            minWk: -1,
            majWk: -3
        },
        bonus: {
            majSt: 1,
            minSt: .75,
            none: 0,
            minWk: .5,
            majWk: .25
        }
    },
    weaponsmallpiercing: {
        scaling: {
            majSt: 6,
            minSt: 3,
            none: 0,
            minWk: -0,
            majWk: -3
        },
        bonus: {
            majSt: 1,
            minSt: .75,
            none: 0,
            minWk: .5,
            majWk: .25
        }
    },
    andslashing: {
        scaling: {
            majSt: 3,
            minSt: 2,
            none: 2,
            minWk: 1,
            majWk: 0
        },
        bonus: {
            majSt: .75,
            minSt: .5,
            none: 0,
            minWk: .2,
            majWk: .1
        }
    },
    andcrushing: {
        scaling: {
            majSt: 4,
            minSt: 2,
            none: 0,
            minWk: -1,
            majWk: -2
        },
        bonus: {
            majSt: 1,
            minSt: .75,
            none: 0,
            minWk: .5,
            majWk: .25
        }
    },
    weaponsmallslashing: {
        scaling: {
            majSt: 2,
            minSt: 1,
            none: 0,
            minWk: -1,
            majWk: -2
        },
        bonus: {
            majSt: .75,
            minSt: .5,
            none: 0,
            minWk: .2,
            majWk: .1
        }
    },
    flanks: {
        scaling: {
            majSt: 2,
            minSt: 1,
            none: 0,
            minWk: -1,
            majWk: -2
        },
        bonus: {
            majSt: 1.5,
            minSt: 1,
            none: 0,
            minWk: .5,
            majWk: .25
        }
    },
    attack: {
        scaling: {
            majSt: 5,
            minSt: 3,
            none: 0,
            minWk: -3,
            majWk: -5
        },
        bonus: {
            majSt: 1.25,
            minSt: 1,
            none: 0,
            minWk: .5,
            majWk: .33
        }
    },
    caution: {
        scaling: {
            majSt: .5,
            minSt: .35,
            none: .25,
            minWk: .1,
            majWk: 0
        },
        bonus: {
            majSt: .15,
            minSt: .1,
            none: 0,
            minWk: .05,
            majWk: .01
        }
    },
    fatigue: {
        scaling: {
            majSt: .5,
            minSt: .35,
            none: .25,
            minWk: .1,
            majWk: 0
        },
        bonus: {
            majSt: .15,
            minSt: .1,
            none: 0,
            minWk: .05,
            majWk: .01
        }
    },
    initiative: {
        scaling: {
            majSt: -2,
            minSt: -1,
            none: 0,
            minWk: 2,
            majWk: 4
        },
        bonus: {
            majSt: -1.5,
            minSt: -1.25,
            none: 0,
            minWk: -.75,
            majWk: -.5
        }
    },
    measure: {
        scaling: {
            majSt: 5,
            minSt: 4,
            none: 3,
            minWk: 2,
            majWk: 1
        },
        swarm: {
            majSt: 2,
            minSt: 1,
            none: 0,
            minWk: -1,
            majWk: -2
        },
        bonus: {
            majSt: .75,
            minSt: .5,
            none: 0,
            minWk: .25,
            majWk: .1
        }
    },
    panic: {
        scaling: {
            majSt: .5,
            minSt: .35,
            none: .25,
            minWk: .1,
            majWk: 0
        },
        bonus: {
            majSt: .15,
            minSt: .1,
            none: 0,
            minWk: .05,
            majWk: .01
        }
    },
    rangedistance: {
        scaling: {
            majSt: 200,
            minSt: 100,
            none: 50,
            minWk: 25,
            majWk: 10
        },
        bonus: {
            majSt: 50,
            minSt: 20,
            none: 0,
            minWk: 5,
            majWk: 2
        }
    },
    recovery: {
        base: {
            d3: 2,
            d4: 3,
            d6: 4,
            d8: 5,
            d10: 6,
            d12: 7,
            d20: 11,
        },
        swarm: {
            majSt: -2,
            minSt: -1,
            none: 0,
            minWk: 1,
            majWk: 2
        },
        scaling: {
            majSt: .75,
            minSt: .9,
            none: 1,
            minWk: 1.1,
            majWk: 1.25
        },
        bonus: {
            majSt: .5,
            minSt: .25,
            none: 0,
            minWk: .1,
            majWk: .05
        }
    },
    movement: {
        scaling: {
            majSt: 3,
            minSt: 2.5,
            none: 2.5,
            minWk: 2,
            majWk: 1
        },
        bonus: {
            majSt: .075,
            minSt: .05,
            none: 0,
            minWk: .025,
            majWk: .01
        }
    },
    mental: {
        scaling: {
            majSt: 50,
            minSt: 35,
            none: 25,
            minWk: 20,
            majWk: 15
        },
        bonus: {
            majSt: 15,
            minSt: 10,
            none: 0,
            minWk: 5,
            majWk: 1
        }
    }
}

module.exports = combatSquareController