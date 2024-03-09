const { sendErrorForwardNoFile, createHash } = require('./helpers')

const sendErrorForward = sendErrorForwardNoFile('upsert helper')

const saveUpdateFunctions = {
    upsertRoles: (promiseArray, db, id, res, roles) => {
        db.delete.roles([id, ['', ...roles.map(roles => roles.roleid)]]).then(_ => {
            roles.forEach(({ id: roleid, vitality, hash, name, role, attack, defense, secondaryrole, combatpoints, stress, panic, caution, socialrole, socialpoints, skillrole, skillpoints, socialsecondary, size, fatigue, largeweapons, mental, knockback, singledievitality, noknockback, rollundertrauma }) => {
                if (!hash) {
                    hash = createHash()
                }
                promiseArray.push(db.add.roles(roleid, id, vitality, hash, name, role, attack, defense, secondaryrole, combatpoints, stress, panic, caution, socialrole, socialpoints, skillrole, skillpoints, socialsecondary, size, fatigue, largeweapons, mental, knockback, singledievitality, noknockback, rollundertrauma).catch(e => sendErrorForward('update beast add roles', e, res)))
            })
        }).catch(e => sendErrorForward('update beast delete roles', e, res))
    },
    upsertTypes: (promiseArray, db, id, res, types) => {
        types.forEach(val => {
            if (!val.id) {
                promiseArray.push(db.add.type(id, val.typeid).catch(e => sendErrorForward('update beast add types', e, res)))
            } else if (val.deleted) {
                promiseArray.push(db.delete.type(val.id).catch(e => sendErrorForward('update beast delete types', e, res)))
            }
        })
    },
    upsertClimates: (promiseArray, db, id, res, climates) => {
        climates.beast.forEach(val => {
            if (val.deleted) {
                promiseArray.push(db.delete.climate.climate(val.uniqueid).catch(e => sendErrorForward('update beast delete climate', e, res)))
            } else if (!val.uniqueid) {
                promiseArray.push(db.add.climate(id, val.climateid).catch(e => sendErrorForward('update beast add climate', e, res)))
            }
        })
    },
    upsertCombats: (promiseArray, db, id, res, combatStatArray) => {
        promiseArray.push(db.delete.combatStats([id, [0, ...combatStatArray.map(combatStat => combatStat.id)]]).then(_ => {
            return combatStatArray.map(({ id: uniqueid, roleid, piercingweapons, slashingweapons, crushingweapons, weaponsmallslashing,
                weaponsmallcrushing, weaponsmallpiercing, andslashing, andcrushing, flanks, rangeddefence, alldefense, allaround, armorandshields,
                unarmored, attack, isspecial, eua, addsizemod, weapon, shield, armor, weaponname, rangeddefense, initiative, measure, recovery, showonlydefenses, weapontype, rangedistance, swarmbonus, adjustment, tdr, info }) => {
                if (!uniqueid) {
                    return db.add.combatStats(id, roleid, piercingweapons, slashingweapons, crushingweapons, weaponsmallslashing,
                        weaponsmallcrushing, weaponsmallpiercing, andslashing, andcrushing, flanks, rangeddefence, alldefense, allaround, armorandshields,
                        unarmored, attack, isspecial, eua, addsizemod, weapon, shield, armor, weaponname, rangeddefense, initiative, measure, recovery, showonlydefenses, weapontype, rangedistance, swarmbonus, adjustment, tdr, info).catch(e => sendErrorForward('update beast add combat', e, res))
                } else {
                    return db.update.combatStats(uniqueid, id, roleid, piercingweapons, slashingweapons, crushingweapons, weaponsmallslashing,
                        weaponsmallcrushing, weaponsmallpiercing, andslashing, andcrushing, flanks, rangeddefence, alldefense, allaround, armorandshields,
                        unarmored, attack, isspecial, eua, addsizemod, weapon, shield, armor, weaponname, rangeddefense, initiative, measure, recovery, showonlydefenses, weapontype, rangedistance, swarmbonus, adjustment, tdr, info).catch(e => sendErrorForward('update beast update combat', e, res))
                }
            })
        }).catch(e => sendErrorForward('update beast delete combat', e, res)))
    },
    upsertConflict: (promiseArray, db, id, res, conflict) => {
        let newConflict = []
        Object.keys(conflict).forEach(key => newConflict = [...newConflict, ...conflict[key]])
        newConflict.forEach(({ trait, value, type, id: conflictId, deleted, socialroleid, allroles, severity, strength, adjustment }) => {
            if (deleted) {
                promiseArray.push(db.delete.conflict(conflictId).catch(e => sendErrorForward('update beast delete confrontation', e, res)))
            } else if (!conflictId) {
                promiseArray.push(db.add.conflict(id, trait, value, type, socialroleid, allroles, severity, strength, +adjustment).catch(e => sendErrorForward('update beast add confrontation', e, res)))
            } else {
                promiseArray.push(db.update.conflict(id, trait, value, type, conflictId, socialroleid, allroles, severity, strength, +adjustment).catch(e => sendErrorForward('update beast update roles', e, res)))
            }
        })
    },
    upsertSkills: (promiseArray, db, id, res, skills) => {
        skills.forEach(({ skill, rank, id: skillId, deleted, skillroleid, allroles, strength, adjustment }) => {
            if (deleted) {
                promiseArray.push(db.delete.skill(skillId).catch(e => sendErrorForward('update beast delete skills', e, res)))
            } else if (!skillId) {
                promiseArray.push(db.add.skill(id, skill, rank, skillroleid, allroles, strength, +adjustment).catch(e => sendErrorForward('update beast add skills', e, res)))
            } else {
                promiseArray.push(db.update.skill(id, skill, rank, skillId, skillroleid, allroles, strength, +adjustment).catch(e => sendErrorForward('update beast update skills', e, res)))
            }
        })
    },
    upsertMovement: (promiseArray, db, id, res, movement) => {
        movement.forEach(({ stroll, walk, jog, run, sprint, type, id: movementId, deleted, roleid, allroles, strollstrength, walkstrength, jogstrength, runstrength, sprintstrength, adjustment }) => {
            if (deleted) {
                promiseArray.push(db.delete.movement(movementId).catch(e => sendErrorForward('update beast delete movement', e, res)))
            } else if (!movementId) {
                promiseArray.push(db.add.movement(id, stroll, walk, jog, run, sprint, type, roleid, allroles, strollstrength, walkstrength, jogstrength, runstrength, sprintstrength, +adjustment).catch(e => sendErrorForward('update beast add movement', e, res)))
            } else {
                promiseArray.push(db.update.movement(id, stroll, walk, jog, run, sprint, type, movementId, roleid, allroles, strollstrength, walkstrength, jogstrength, runstrength, sprintstrength, +adjustment).catch(e => sendErrorForward('update beast update movement', e, res)))
            }
        })
    },
    upsertVariants: (promiseArray, db, id, res, variants) => {
        variants.forEach(({ id: checkId, variantid, deleted }) => {
            if (deleted) {
                promiseArray.push(db.delete.variants(id, variantid).catch(e => sendErrorForward('update beast delete variants 1', e, res)))
                promiseArray.push(db.delete.variants(variantid, id).catch(e => sendErrorForward('update beast delete variants 2', e, res)))
            } else if (!checkId) {
                promiseArray.push(db.add.variants(id, variantid).catch(e => sendErrorForward('update beast add variants 1', e, res)))
                promiseArray.push(db.add.variants(variantid, id).catch(e => sendErrorForward('update beast add variants 2', e, res)))
            }
        })
    },
    upsertLoot: (promiseArray, db, id, res, loot) => {
        loot.forEach(({ loot, price, id: lootId, deleted }) => {
            if (deleted) {
                promiseArray.push(db.delete.loot(lootId).catch(e => sendErrorForward('update beast delete beast loot', e, res)))
            } else if (!lootId) {
                promiseArray.push(db.add.loot(id, loot, price).catch(e => sendErrorForward('update beast add beast loot', e, res)))
            } else {
                promiseArray.push(db.update.loot(id, loot, price, lootId).catch(e => sendErrorForward('update beast update beast loot', e, res)))
            }
        })
    },
    upsertReagents: (promiseArray, db, id, res, reagents) => {
        reagents.forEach(({ name, spell, difficulty, harvest, id: reagentId, deleted }) => {
            if (deleted) {
                promiseArray.push(db.delete.reagents(reagentId).catch(e => sendErrorForward('update beast delete pleroma', e, res)))
            } else if (!reagentId) {
                promiseArray.push(db.add.reagents(id, name, spell, difficulty, harvest).catch(e => sendErrorForward('update beast add pleroma', e, res)))
            } else {
                promiseArray.push(db.update.reagents(id, name, spell, difficulty, harvest, reagentId).catch(e => sendErrorForward('update beast update pleroma', e, res)))
            }
        })
    },
    upsertLocation: (promiseArray, db, id, res, locationalvitality) => {
        if (locationalvitality.length > 0) {
            locationalvitality.forEach(({ id: locationid, location, vitality, beastid, deleted, roleid, allroles }) => {
                if (deleted) {
                    promiseArray.push(db.delete.locationalvitality(locationid).catch(e => sendErrorForward('update beast delete locational vitality', e, res)))
                } else if (locationid && beastid) {
                    promiseArray.push(db.update.locationalvitality(beastid, location, vitality, locationid, roleid, allroles).catch(e => sendErrorForward('update beast update locational vitality', e, res)))
                } else {
                    promiseArray.push(db.add.locationalvitality(id, location, vitality, allroles, roleid).catch(e => sendErrorForward('update beast add locational vitality', e, res)))
                }
            })
        }
    },
    upsertArtist: (promiseArray, db, id, res, artistInfo) => {
        let { id: dbid, artistid, artist, tooltip, link } = artistInfo;
        if (artist) {
            if (!artistid) {
                promiseArray.push(db.add.allartists(artist, tooltip, link).then(result => {
                    return promiseArray.push(db.add.artist(id, result[0].id).then(result => result).catch(e => sendErrorForward('update beast add artist 1', e, res)))
                }).catch(e => sendErrorForward('update beast add all artists', e, res)))
            } else {
                promiseArray.push(db.add.artist(id, artistid).then(result => result).catch(e => sendErrorForward('update beast add artist 2', e, res)))
            }
        }
    },
    deleteTables: (promiseArray, db, id, res, appearance, habitat, attack, defense) => {
        promiseArray.push(db.delete.table(id, [0, ...appearance.map(table => table.id), ...habitat.map(table => table.id), ...attack.map(table => table.id), ...defense.map(table => table.id)]))
    },
    upsertApperanceTable: (promiseArray, db, id, res, appearance) => {
        appearance.forEach(table => {
            if (table.id) {
                promiseArray.push(db.update.alltables(table.id, table.label).catch(e => sendErrorForward('update beast appearance all tables', e, res)))
                db.delete.rows([table.id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
                    table.rows.forEach(({ weight, value, id: rowid }) => {
                        promiseArray.push(db.add.row(rowid, table.id, weight, value).catch(e => sendErrorForward('update beast appearance add rows', e, res)))
                    })
                }).catch(e => sendErrorForward('update beast appearance delete row', e, res))
            } else {
                promiseArray.push(db.add.alltables(table.label, 'ap').then(result => {
                    promiseArray.push(db.add.table(id, result[0].id).catch(e => sendErrorForward('update beast appearance add table2 ', e, res)))
                    db.delete.rows([result[0].id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
                        table.rows.forEach(({ weight, value, id: rowid }) => {
                            promiseArray.push(db.add.row(rowid, result[0].id, weight, value).catch(e => sendErrorForward('update beast appearance add rows 2', e, res)))
                        })
                    }).catch(e => sendErrorForward('update beast appearance delete rows 2', e, res))
                }).catch(e => sendErrorForward('update beast appearance all tables 2', e, res)))
            }
        })
    },
    upsertHabitatTable: (promiseArray, db, id, res, habitat) => {
        habitat.forEach(table => {
            if (table.id) {
                promiseArray.push(db.update.alltables(table.id, table.label).catch(e => sendErrorForward('update beast habitat all tables', e, res)))
                db.delete.rows([table.id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
                    table.rows.forEach(({ weight, value, id: rowid }) => {
                        promiseArray.push(db.add.row(rowid, table.id, weight, value).catch(e => sendErrorForward('update beast habitat add rows', e, res)))
                    })
                }).catch(e => sendErrorForward('update beast habitat delete rows', e, res))
            } else {
                promiseArray.push(db.add.alltables(table.label, 'ha').then(result => {
                    promiseArray.push(db.add.table(id, result[0].id))
                    db.delete.rows([result[0].id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
                        table.rows.forEach(({ weight, value, id: rowid }) => {
                            promiseArray.push(db.add.row(rowid, result[0].id, weight, value).catch(e => sendErrorForward('update beast habitat add rows 2', e, res)))
                        })
                    }).catch(e => sendErrorForward('update beast habitat delete rows 2', e, res))
                }).catch(e => sendErrorForward('update beast habitat all tables 2', e, res)))
            }
        })
    },
    upsertAttackTable: (promiseArray, db, id, res, attack) => {
        attack.forEach(table => {
            if (table.id) {
                promiseArray.push(db.update.alltables(table.id, table.label).catch(e => sendErrorForward('update beast attack all tables', e, res)))
                db.delete.rows([table.id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
                    table.rows.forEach(({ weight, value, id: rowid }) => {
                        promiseArray.push(db.add.row(rowid, table.id, weight, value).catch(e => sendErrorForward('update beast attack add rows', e, res)))
                    })
                }).catch(e => sendErrorForward('update beast attack delete rows', e, res))
            } else {
                promiseArray.push(db.add.alltables(table.label, 'at').then(result => {
                    promiseArray.push(db.add.table(id, result[0].id))
                    db.delete.rows([result[0].id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
                        table.rows.forEach(({ weight, value, id: rowid }) => {
                            promiseArray.push(db.add.row(rowid, result[0].id, weight, value).catch(e => sendErrorForward('update beast attack add rows 2', e, res)))
                        })
                    }).catch(e => sendErrorForward('update beast attack delete rows 2', e, res))
                }).catch(e => sendErrorForward('update beast attack all tables 2', e, res)))
            }
        })
    },
    upsertDefenseTable: (promiseArray, db, id, res, defense) => {
        defense.forEach(table => {
            if (table.id) {
                promiseArray.push(db.update.alltables(table.id, table.label).catch(e => sendErrorForward('update beast defense all tables', e, res)))
                db.delete.rows([table.id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
                    table.rows.forEach(({ weight, value, id: rowid }) => {
                        promiseArray.push(db.add.row(rowid, table.id, weight, value).catch(e => sendErrorForward('update beast defense add rows', e, res)))
                    })
                }).catch(e => sendErrorForward('update beast defense delete rows', e, res))
            } else {
                promiseArray.push(db.add.alltables(table.label, 'de').then(result => {
                    promiseArray.push(db.add.table(id, result[0].id).catch(e => sendErrorForward('update beast defense all tables 2', e, res)))
                    db.delete.rows([result[0].id, [0, ...table.rows.map(row => row.id)]]).then(_ => {
                        table.rows.forEach(({ weight, value, id: rowid }) => {
                            promiseArray.push(db.add.row(rowid, result[0].id, weight, value).catch(e => sendErrorForward('update beast defense add rows', e, res)))
                        })
                    }).catch(e => sendErrorForward('update beast defense delete rows ', e, res))
                }).catch(e => sendErrorForward('update beast defense all tables 2', e, res)))
            }
        })
    },
    upsertTemperament: (promiseArray, db, id, res, temperament) => {
        temperament.temperament.forEach(({ temperament: temp, weight, id: tempid, beastid, tooltip, deleted }) => {
            if (deleted) {
                promiseArray.push(db.delete.encounter.temperament(beastid, tempid).catch(e => sendErrorForward('update beast delete temp', e, res)))
            } else if ((tempid && !beastid) || (tempid && beastid !== id)) {
                promiseArray.push(db.add.encounter.temperament(id, tempid, weight).catch(e => sendErrorForward('update beast add temp', e, res)))
            } else if (tempid && beastid) {
                promiseArray.push(db.update.encounter.temperament(weight, beastid, tempid).catch(e => sendErrorForward('update beast update temp', e, res)))
            } else if (!tempid) {
                db.add.encounter.allTemp(temp, tooltip).then(result => {
                    promiseArray.push(db.add.encounter.temperament(id, result[0].id, weight).catch(e => sendErrorForward('update beast add temp 2', e, res)))
                }).catch(e => sendErrorForward('update beast add all temp', e, res))
            }
        })
    },
    upsertGroups: (promiseArray, db, id, res, groups) => {
        groups.forEach(({ id: groupid, beastid, deleted, label, weights, weight }) => {
            if (deleted) {
                promiseArray.push(db.delete.encounter.groups(id, groupid).then(_ => db.delete.encounter.groupRoles(beastid, groupid).catch(e => sendErrorForward('update beast delete group roles', e, res))).catch(e => sendErrorForward('update beast delete groups', e, res)))
            } else if (groupid && beastid) {
                promiseArray.push(db.update.encounter.groups(beastid, groupid, label, +weight).then(_ => {
                    let groupPromises = []
                    weights.forEach(({ id: roleid, weight: roleweight, role, deleted }) => {
                        if (deleted && roleid) {
                            groupPromises.push(db.delete.encounter.groupRoles(id, roleid).catch(e => sendErrorForward('update beast delete groups role', e, res)))
                        } else if (roleid) {
                            groupPromises.push(db.update.encounter.groupRoles(id, roleid, groupid, +roleweight, role).catch(e => sendErrorForward('update beast update groups role', e, res)))
                        } else {
                            groupPromises.push(db.add.encounter.groupRoles(id, groupid, +roleweight, role).catch(e => sendErrorForward('update beast add groups role', e, res)))
                        }
                    })
                    return Promise.all(groupPromises)
                }).catch(e => sendErrorForward('update beast update groups', e, res)))
            } else if (!groupid) {
                promiseArray.push(db.add.encounter.groups(id, label, +weight).then(result => {
                    let groupPromises = []
                    groupid = result[0].id
                    weights.forEach(({ id: roleid, weight: roleweight, role }) => {
                        if (roleid) {
                            groupPromises.push(db.update.encounter.groupRoles(id, roleid, groupid, +roleweight, role).catch(e => sendErrorForward('update beast update groups role 2', e, res)))
                        } else {
                            groupPromises.push(db.add.encounter.groupRoles(id, groupid, +roleweight, role).catch(e => sendErrorForward('update beast add groups role 2', e, res)))
                        }
                    })
                    return Promise.all(groupPromises)
                }).catch(e => sendErrorForward('update beast add groups 2', e, res)))
            }
        })
    },
    upsertNumbers: (promiseArray, db, id, res, numbers) => {
        numbers.forEach(({ id: numberid, beastid, deleted, numbers, miles, weight }) => {
            if (deleted) {
                promiseArray.push(db.delete.encounter.numbers(id, numberid).catch(e => sendErrorForward('update beast delete numbers', e, res)))
            } else if (numberid) {
                promiseArray.push(db.update.encounter.numbers(id, numberid, numbers, miles, +weight).catch(e => sendErrorForward('update beast update numbers', e, res)))
            } else if (!numberid) {
                promiseArray.push(db.add.encounter.numbers(id, numbers, miles, +weight).catch(e => sendErrorForward('update beast add numbers', e, res)))
            }
        })
    },
    upsertSigns: (promiseArray, db, id, res, signs) => {
        signs.signs.forEach(({ sign, weight, id: signid, beastid, deleted }) => {
            if (deleted) {
                promiseArray.push(db.delete.encounter.sign(beastid, signid).catch(e => sendErrorForward('update beast delete sign', e, res)))
            } else if ((signid && !beastid) || (signid && beastid !== id)) {
                promiseArray.push(db.add.encounter.sign(id, signid, weight).catch(e => sendErrorForward('update beast add sign', e, res)))
            } else if (signid && beastid) {
                promiseArray.push(db.update.encounter.signs(weight, beastid, signid).catch(e => sendErrorForward('update beast update sign', e, res)))
            } else if (!signid) {
                db.add.encounter.allSigns(sign).then(result => {
                    promiseArray.push(db.add.encounter.sign(id, result[0].id, weight).catch(e => sendErrorForward('update beast add sign w/ weight', e, res)))
                }).catch(e => sendErrorForward('update beast all signs', e, res))
            }
        })
    },
    upsertVerb: (promiseArray, db, id, res, verb) => {
        verb.verb.forEach(({ verb, id: verbid, beastid, deleted }) => {
            if (deleted) {
                promiseArray.push(db.delete.encounter.verb(beastid, verbid).catch(e => sendErrorForward('update beast delete verb', e, res)))
            } else if ((verbid && !beastid) || (verbid && beastid !== id)) {
                promiseArray.push(db.add.encounter.verb(verbid, id).catch(e => sendErrorForward('update beast add add', e, res)))
            } else if (!verbid) {
                db.add.encounter.allVerb(verb).then(result => {
                    promiseArray.push(db.add.encounter.verb(result[0].id, id).catch(e => sendErrorForward('update beast add verb 2', e, res)))
                }).catch(e => sendErrorForward('update beast add all verbs', e, res))
            }
        })
    },
    upsertNoun: (promiseArray, db, id, res, noun) => {
        noun.noun.forEach(({ noun, id: nounid, beastid, deleted }) => {
            if (deleted) {
                promiseArray.push(db.delete.encounter.noun(beastid, nounid).catch(e => sendErrorForward('update beast delete noun', e, res)))
            } else if ((nounid && !beastid) || (nounid && beastid !== id)) {
                promiseArray.push(db.add.encounter.noun(nounid, id).catch(e => sendErrorForward('update beast add noun', e, res)))
            } else if (!nounid) {
                db.add.encounter.allNoun(noun).then(result => {
                    promiseArray.push(db.add.encounter.noun(result[0].id, id).catch(e => sendErrorForward('update beast add noun 2', e, res)))
                }).catch(e => sendErrorForward('update beast all nouns', e, res))
            }
        })
    },
    upsertLairBasic: (promiseArray, db, id, res, beastid, copper, silver, gold, potion, relic, enchanted, talisman) => {
        if (!beastid) {
            promiseArray.push(db.add.loot.lairbasic(id, copper, silver, gold, potion, relic, enchanted, talisman).catch(e => sendErrorForward('update beast add basic lair', e, res)))
        } else {
            promiseArray.push(db.update.loot.lairbasic(id, copper, silver, gold, potion, relic, enchanted, talisman).catch(e => sendErrorForward('update beast update basic lair', e, res)))
        }
    },
    upsertEquipmentLair: (promiseArray, db, id, res, equipment = []) => {
        equipment.forEach(({ id: equipid, beastid, value, number, deleted }) => {
            if (deleted) {
                promiseArray.push(db.delete.loot.lairequipment(beastid, equipid).catch(e => sendErrorForward('update beast delete lair equipment', e, res)))
            } else if (equipid && beastid) {
                promiseArray.push(db.update.loot.lairequipment(equipid, value, number).catch(e => sendErrorForward('update beast update lair equipment', e, res)))
            } else {
                promiseArray.push(db.add.loot.lairequipment(id, value, number).catch(e => sendErrorForward('update beast add lair equipment', e, res)))
            }
        })
    },
    upsertTraitedLair: (promiseArray, db, id, res, traited = []) => {
        traited.forEach(({ id: traitedid, beastid, value, chancetable, deleted }) => {
            if (deleted) {
                promiseArray.push(db.delete.loot.lairtraited(beastid, traitedid).catch(e => sendErrorForward('update beast delete lair traited equipment', e, res)))
            } else if (traitedid && beastid) {
                promiseArray.push(db.update.loot.lairtraited(traitedid, value, chancetable).catch(e => sendErrorForward('update beast update lair equipment', e, res)))
            } else {
                promiseArray.push(db.add.loot.lairtraited(id, value, chancetable).catch(e => sendErrorForward('update beast add lair equipment', e, res)))
            }
        })
    },
    upsertScrollsLair: (promiseArray, db, id, res, scrolls = []) => {
        scrolls.forEach(({ id: scrollid, beastid, number, power, deleted }) => {
            if (deleted) {
                promiseArray.push(db.delete.loot.lairscrolls(beastid, scrollid).catch(e => sendErrorForward('update beast delete lair scrolls', e, res)))
            } else if (scrollid && beastid) {
                promiseArray.push(db.update.loot.lairscrolls(scrollid, number, power).catch(e => sendErrorForward('update beast update lair scrolls', e, res)))
            } else {
                promiseArray.push(db.add.loot.lairscrolls(id, number, power).catch(e => sendErrorForward('update beast add lair scrolls', e, res)))
            }
        })
    },
    upsertAlmsLair: (promiseArray, db, id, res, alms = []) => {
        alms.forEach(({ id: almid, beastid, number, favor, deleted }) => {
            if (deleted) {
                promiseArray.push(db.delete.loot.lairalms(beastid, almid).catch(e => sendErrorForward('update beast delete lair alms', e, res)))
            } else if (almid && beastid) {
                promiseArray.push(db.update.loot.lairalms(almid, number, favor).catch(e => sendErrorForward('update beast update lair alms', e, res)))
            } else {
                promiseArray.push(db.add.loot.lairalms(id, number, favor).catch(e => sendErrorForward('update beast add lair alms', e, res)))
            }
        })
    },
    upsertBasicCarried: (promiseArray, db, id, res, cbeastid, ccopper, csilver, cgold, cpotion, crelic, cenchanted, ctalisman) => {
        if (!cbeastid) {
            promiseArray.push(db.add.loot.carriedbasic(id, ccopper, csilver, cgold, cpotion, crelic, cenchanted, ctalisman).catch(e => sendErrorForward('update beast add carried basic', e, res)))
        } else {
            promiseArray.push(db.update.loot.carriedbasic(cbeastid, ccopper, csilver, cgold, cpotion, crelic, cenchanted, ctalisman).catch(e => sendErrorForward('update beast update carried basic', e, res)))
        }
    },
    upsertEquipmentCarried: (promiseArray, db, id, res, cequipment = []) => {
        cequipment.forEach(({ id: equipid, beastid: cbeastid, value, number, deleted }) => {
            if (deleted) {
                promiseArray.push(db.delete.loot.carriedequipment(cbeastid, equipid).catch(e => sendErrorForward('update beast delete carried equipment', e, res)))
            } else if (equipid && cbeastid) {
                promiseArray.push(db.update.loot.carriedequipment(equipid, value, number).catch(e => sendErrorForward('update beast update carried equipment', e, res)))
            } else {
                promiseArray.push(db.add.loot.carriedequipment(id, value, number).catch(e => sendErrorForward('update beast add carried equipment', e, res)))
            }
        })
    },
    upsertTraitedCarried: (promiseArray, db, id, res, ctraited = []) => {
        ctraited.forEach(({ id: traitedid, beastid: cbeastid, value, chancetable, deleted }) => {
            if (deleted) {
                promiseArray.push(db.delete.loot.carriedtraited(cbeastid, traitedid).catch(e => sendErrorForward('update beast delete carried equipment', e, res)))
            } else if (traitedid && cbeastid) {
                promiseArray.push(db.update.loot.carriedtraited(traitedid, value, chancetable).catch(e => sendErrorForward('update beast update carried equipment', e, res)))
            } else {
                promiseArray.push(db.add.loot.carriedtraited(id, value, chancetable).catch(e => sendErrorForward('update beast add carried equipment', e, res)))
            }
        })
    },
    upsertScrollsCarried: (promiseArray, db, id, res, cscrolls = []) => {
        cscrolls.forEach(({ id: scrollid, beastid: cbeastid, number, power, deleted }) => {
            if (deleted) {
                promiseArray.push(db.delete.loot.carriedscrolls(cbeastid, scrollid).catch(e => sendErrorForward('update beast delete carried scrolls', e, res)))
            } else if (scrollid && cbeastid) {
                promiseArray.push(db.update.loot.carriedscrolls(scrollid, number, power).catch(e => sendErrorForward('update beast update carried scrolls', e, res)))
            } else {
                promiseArray.push(db.add.loot.carriedscrolls(id, number, power).catch(e => sendErrorForward('update beast add carried scrolls', e, res)))
            }
        })
    },
    upsertAlmsCarried: (promiseArray, db, id, res, calms = []) => {
        calms.forEach(({ id: almid, beastid: cbeastid, number, favor, deleted }) => {
            if (deleted) {
                promiseArray.push(db.delete.loot.carriedalms(cbeastid, almid).catch(e => sendErrorForward('update beast delete carried alms', e, res)))
            } else if (almid && cbeastid) {
                promiseArray.push(db.update.loot.carriedalms(almid, number, favor).catch(e => sendErrorForward('update beast update carried alms', e, res)))
            } else {
                promiseArray.push(db.add.loot.carriedalms(id, number, favor).catch(e => sendErrorForward('update beast add carried alms', e, res)))
            }
        })
    },
    upsertCasting: (promiseArray, db, id, res, casting) => {
        if (casting.beastid) {
            let { augur, wild, vancian, spellnumberdie, manifesting, commanding, bloodpact, defaulttype } = casting
            promiseArray.push(db.update.casting(augur, wild, vancian, spellnumberdie, manifesting, commanding, bloodpact, defaulttype, id).catch(e => sendErrorForward('update beast update casting', e, res)))
        } else {
            promiseArray.push(db.update.casting(null, null, null, 'd4', null, null, null, null, id).catch(e => sendErrorForward('update beast update casting 2', e, res)))
        }
    },
    upsertSpells: (promiseArray, db, id, res, spells = []) => {
        spells.forEach(({ id: spellid, name, origin, shape, range, interval, effect, beastid, allroles, roleid, resist }) => {
            if (beastid) {
                promiseArray.push(db.update.spell(spellid, name, origin, shape, range, interval, effect, beastid, allroles, roleid, resist).catch(e => sendErrorForward('update beast update spell', e, res)))
            } else {
                promiseArray.push(db.add.spell(spellid, name, origin, shape, range, interval, effect, id, allroles, roleid, resist).catch(e => sendErrorForward('update beast add spell', e, res)))
            }
        })
    },
    deleteFromSpellList: (promiseArray, db, id, res, deletedSpellList = []) => {
        deletedSpellList.forEach(val => {
            promiseArray.push(db.delete.spell(val, id).catch(e => sendErrorForward('update beast delete spell', e, res)))
        })
    },
    upsertObstacles: (promiseArray, db, id, res, obstacles) => {
        promiseArray.push(db.delete.obstacles([id, [0, ...obstacles.map(obstacles => obstacles.id)]]).then(_ => {
            return obstacles.map(({ id: uniqueid, obstacleid, notes }) => {
                if (!uniqueid) {
                    return db.add.obstacles(id, obstacleid, notes).catch(e => sendErrorForward('update beast add obstacles', e, res))
                } else {
                    return true
                }
            })
        }).catch(e => sendErrorForward('update beast delete obstacles', e, res)))
    },
    upsertChallenges: (promiseArray, db, id, res, challenges) => {
        promiseArray.push(db.delete.challenges([id, [0, ...challenges.map(challenges => challenges.id)]]).then(_ => {
            return challenges.map(({ id: uniqueid, challengeid }) => {
                if (!uniqueid) {
                    return db.add.challenges(id, challengeid).catch(e => sendErrorForward('update beast add challenges', e, res))
                } else {
                    return true
                }
            })
        }).catch(e => sendErrorForward('update beast delete challenges', e, res)))
    },
    upsertFolklore: (promiseArray, db, id, res, folklore) => {
        promiseArray.push(db.delete.folklore([id, [0, ...folklore.map(folklore => folklore.id)]]).then(_ => {
            return folklore.map(({ id: uniqueid, belief, truth }) => {
                if (!uniqueid) {
                    return db.add.folklore(id, belief, truth).catch(e => sendErrorForward('update beast add folklore', e, res))
                } else {
                    return db.update.folklore(uniqueid, id, belief, truth).catch(e => sendErrorForward('update beast update folklore', e, res))
                }
            })
        }).catch(e => sendErrorForward('update beast delete folkore', e, res)))
    }
}

module.exports = saveUpdateFunctions