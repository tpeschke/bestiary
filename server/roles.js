module.exports = {
    combatRoles: {
        primary: {
            'Artillery': {
                strengths: ['Vitality', 'Ranged Damage', 'Ranged Attack', 'Ranged Penalties'],
                weaknesses: ['/DR', 'Parry', 'Parry DR', 'Parry /DR', 'Melee Damage', 'Melee Attack', 'Recovery', 'Movement', 'Caution Threshold'],
                spdbonus: 3,
                vitality: 30,
                fatigue: 'C',
                def: 0,
                dr: {
                    flat: 0,
                    slash: 0
                },
                parry: 0,
                shield_dr: {
                    flat: 0,
                    slash: 0
                },
                damage: {
                    dice: ['2d4!'],
                    flat: 0
                },
                rangedDamage: {
                    dice: ['2d10!'],
                    flat: 0
                },
                atk: 0,
                rangedAtk: 5,
                spd: 20,
                measure: 1,
                ranges: {
                    increment: 100
                },
                stressThreshold: 30,
                panic: 25,
                caution: 10,
                init: 0,
                combatpointsmelee: 0,
                combatpointsranged: 0,
                damagebonus: 2,
                weapons: [
                    {
                        label: 'Ranged',
                        items: ['Bellybow', 'Crossbow', 'Latchet Crossbow', 'Longbow', 'Warbow']
                    },
                    {
                        label: 'Sidearms',
                        items: ['Dagger (P)', 'Dagger (S)']
                    }
                ],
                armor: ['Buff Coat'],
                shields: ['Buckler']
            },
            'Brute': {
                strengths: ['Vitality', 'Melee Damage', 'Melee Attack', 'Caution Threshold'],
                weaknesses: ['Defense', 'Parry', 'Parry DR', 'Parry /DR', 'Ranged Damage', 'Ranged Attack', 'Recovery', 'Ranged Penalties', 'Movement', 'Mobility Skills'],
                spdbonus: 2,
                vitality: 80,
                fatigue: 'B',
                def: -4,
                dr: {
                    flat: 3,
                    slash: 1
                },
                parry: 0,
                shield_dr: {
                    flat: 0,
                    slash: 0
                },
                damage: {
                    dice: ['3d8!'],
                    flat: 0
                },
                rangedDamage: {
                    dice: [],
                    flat: 0
                },
                atk: 4,
                rangedAtk: 0,
                spd: 15,
                measure: 2,
                ranges: {
                    increment: 0
                },
                stressThreshold: 30,
                panic: 25,
                caution: 20,
                init: 0,
                damagebonus: 1,
                weapons: [
                    {
                        label: 'Axes',
                        items: ['Bardiche', 'Battle Axe']
                    },
                    {
                        label: 'Polearms',
                        items: ['Ranseur', 'War-scythe']
                    },
                    {
                        label: 'Sidearms',
                        items: ['Dagger (P)', 'Dagger (S)']
                    },
                    {
                        label: 'Swords',
                        items: ['Zweihander']
                    },
                    {
                        label: 'Trauma',
                        items: ['Club', 'Mace', 'Maul', 'War Flail', 'War Hammer']
                    }
                ],
                armor: ['Chainmail', 'Plated Mail'],
                shields: [],
            },
            'Defender': {
                strengths: ['Defense', 'DR', '/DR', 'Parry', 'Parry DR', 'Parry /DR', 'Stress Threshold', 'Caution Threshold'],
                weaknesses: ['Melee Damage', 'Ranged Damage', 'Melee Attack', 'Ranged Attack', 'Ranged Penalties', 'Movement', 'Mobility Skills'],
                spdbonus: 0,
                vitality: 40,
                fatigue: 'C',
                def: -3,
                dr: {
                    flat: 2,
                    slash: 2
                },
                parry: 7,
                shield_dr: {
                    flat: 2,
                    slash: 2
                },
                damage: {
                    dice: ['4d3!'],
                    flat: 0
                },
                rangedDamage: {
                    dice: [],
                    flat: 0
                },
                atk: 0,
                rangedAtk: 0,
                spd: 12,
                measure: 2,
                ranges: {
                    increment: 0
                },
                stressThreshold: 40,
                panic: 50,
                caution: 30,
                init: 0,
                damagebonus: -1,
                weapons: [
                    {
                        label: 'Polearms',
                        items: ['Bill', 'Guisarme', 'Pike']
                    },
                    {
                        label: 'Sidearms',
                        items: ['Dagger (P)', 'Dagger (S)', 'Dusack']
                    },
                    {
                        label: 'Swords',
                        items: ['Arming Sword', 'Court Sword', 'Messer', 'Sabre', 'Schiavona']
                    }
                ],
                armor: ['Scale', 'Laminar (Banded Mail)', 'Full Plate'],
                shields: ['Heater', 'Figure Eight', 'Kite'],
            },
            'Duelist': {
                strengths: ['Parry', 'Recovery', 'Mobility Skills', 'Stress Threshold'],
                weaknesses: ['/DR', 'Melee Damage', 'Ranged Damage', 'Range Penalties'],
                spdbonus: -3,
                vitality: 30,
                fatigue: 'C',
                def: 0,
                dr: {
                    flat: 3,
                    slash: 0
                },
                parry: 4,
                shield_dr: {
                    flat: 0,
                    slash: 2
                },
                damage: {
                    dice: ['2d6!'],
                    flat: 0
                },
                rangedDamage: {
                    dice: [],
                    flat: 0
                },
                atk: 1,
                rangedAtk: 0,
                spd: 5,
                measure: 2,
                ranges: {
                    increment: 0
                },
                stressThreshold: 40,
                panic: 50,
                caution: 20,
                init: 0,
                damagebonus: 0,
                weapons: [
                    {
                        label: 'Polearms',
                        items: ['Halberd (S)', 'Halberd (P)', 'Planson', 'Short Spear', 'Voulge']
                    },
                    {
                        label: 'Sidearms',
                        items: ['Dagger (P)', 'Dagger (S)', 'Scourge', 'Stiletto']
                    },
                    {
                        label: 'Swords',
                        items: ['Estoc', 'Longsword', 'Rapier']
                    },
                    {
                        label: 'Trauma',
                        items: ['Goedenag', 'Quarterstaff', 'Rapier']
                    }
                ],
                armor: ['Gambeson', 'Leather'],
                shields: ['Buckler']
            },
            'Flanker': {
                strengths: ['Melee Damage', 'Recovery', 'Movement', 'Mobility Skills'],
                weaknesses: ['Defense', 'DR', '/DR', 'Ranged Damage', 'Melee Attack', 'Ranged Attack', 'Range Penalties', 'Caution Threshold'],
                spdbonus: -1,
                vitality: 30,
                fatigue: 'C',
                def: 0,
                dr: {
                    flat: 0,
                    slash: 0
                },
                parry: 0,
                shield_dr: {
                    flat: 0,
                    slash: 0
                },
                damage: {
                    dice: ['3d6!'],
                    flat: 0
                },
                rangedDamage: {
                    dice: [],
                    flat: 0
                },
                atk: -2,
                rangedAtk: 0,
                spd: 7,
                measure: 0,
                ranges: {
                    increment: 0
                },
                stressThreshold: 30,
                panic: 25,
                caution: 10,
                init: 0,
                damagebonus: 2,
                weapons: [
                    {
                        label: 'Sidearms',
                        items: ['Cinquedea', 'Dagger (P)', 'Dagger (S)', 'Katzbalger']
                    },
                    {
                        label: 'Trauma',
                        items: ['Bludgeon']
                    }
                ],
                armor: ['Gambeson', 'Leather'],
                shields: []
            },
            'Fodder': {
                strengths: ['Melee Damage', 'Ranged Damage', 'Melee Attack', 'Mobility Skills'],
                weaknesses: ['Vitality', 'Fatigue', '/DR', 'DR', 'Parry', 'Parry DR', 'Parry /DR', 'Movement', 'Stress Threshold', 'Panic Threshold', 'Caution Threshold'],
                spdbonus: 0,
                vitality: 15,
                fatigue: 'H',
                def: -2,
                dr: {
                    flat: 0,
                    slash: 0
                },
                parry: 0,
                shield_dr: {
                    flat: 0,
                    slash: 0
                },
                damage: {
                    dice: ['4d4!'],
                    flat: 0
                },
                rangedDamage: {
                    dice: ['3d4!'],
                    flat: 0
                },
                atk: 0,
                rangedAtk: 0,
                spd: 13,
                measure: 2,
                ranges: {
                    increment: 15
                },
                stressThreshold: 15,
                panic: 1,
                caution: 10,
                init: 0,
                damagebonus: -2,
                weapons: [],
                armor: ['Buff Coat'],
                shields: ['Clothe'],
            },
            'Shock': {
                strengths: ['Fatigue', 'Melee Damage', 'Measure', 'Movement', 'Mobility Skills', 'Panic Threshold', 'Caution Threshold'],
                weaknesses: ['DR', '/DR', 'Parry', 'Parry DR', 'Parry /DR', 'Ranged Damage', 'Ranged Attack', 'Recovery', 'Range Penalties'],
                spdbonus: 4,
                vitality: 40,
                fatigue: 'C',
                def: -4,
                dr: {
                    flat: 0,
                    slash: 0
                },
                parry: 0,
                shield_dr: {
                    flat: 0,
                    slash: 0
                },
                damage: {
                    dice: ['2d12!'],
                    flat: 0
                },
                rangedDamage: {
                    dice: [],
                    flat: 0
                },
                atk: 2,
                rangedAtk: 0,
                spd: 20,
                measure: 5.5,
                ranges: {
                    increment: 0
                },
                stressThreshold: 30,
                panic: 25,
                caution: 20,
                init: 0,
                damagebonus: 3,
                weapons: [
                    {
                        label: 'Axes',
                        items: ['Horseman\'s pick', 'Lochaber Axe']
                    },
                    {
                        label: 'Polearms',
                        items: ['Glaive', 'Lance', 'Lucerne', 'Sovnya']
                    },
                    {
                        label: 'Sidearms',
                        items: ['Dagger (P)', 'Dagger (S)']
                    },
                    {
                        label: 'Swords',
                        items: ['Executioner\'s Sword', 'Falchion', 'Koncerz']
                    },
                    {
                        label: 'Trauma',
                        items: ['Bec De Corbin', 'Great Hammer', 'Peasant\'s Flail']
                    }
                ],
                armor: ['Coat of Plates'],
                shields: []
            },
            'Skirmisher': {
                strengths: ['Ranged Attack', 'Movement', 'Mobility Skills', 'Stress Threshold', 'Panic'],
                weaknesses: ['DR', '/DR', 'Parry', 'Parry DR', 'Parry /DR', 'Melee Damage', 'Ranged Damage', 'Melee Attack', 'Caution Threshold'],
                spdbonus: 0,
                vitality: 30,
                fatigue: 'C',
                def: 0,
                dr: {
                    flat: 0,
                    slash: 0
                },
                parry: 0,
                shield_dr: {
                    flat: 0,
                    slash: 0
                },
                damage: {
                    dice: ['3d3!'],
                    flat: 0
                },
                rangedDamage: {
                    dice: ['4d3!'],
                    flat: 0
                },
                atk: 0,
                rangedAtk: 2,
                spd: 11,
                measure: 1,
                ranges: {
                    increment: 15
                },
                stressThreshold: 30,
                panic: 25,
                caution: 20,
                init: 0,
                damagebonus: 0,
                weapons: [
                    {
                        label: 'Axes',
                        items: ['Handaxe']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Javelin (P)', 'Short Spear (P)']
                    },
                    {
                        label: 'Ranged',
                        items: ['Composite Bow', 'Javelin', 'Sling', 'Throwing Axe', 'Throwing Knife']
                    },
                    {
                        label: 'Sidearms',
                        items: ['Dagger (P)', 'Dagger (S)', 'Knife']
                    }
                ],
                armor: ['Gambeson', 'Leather'],
                shields: ['Buckler'],
            }
        }
    }
}