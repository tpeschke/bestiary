module.exports = {
    combatRoles: {
        primary: {
            'Artillery': {
                strengths: ['Vitality', 'Ranged Damage', 'Ranged Attack', 'Ranged Penalties'],
                weaknesses: ['/DR', 'Parry', 'Parry DR', 'Parry /DR', 'Melee Damage', 'Melee Attack', 'Recovery', 'Movement', 'Caution Threshold'],
                description: "Artillery have high ranged attack and damage which means that they can threaten anyone on the battlefield, however, their low mobility and melee abilities means that they can often be charged down and taken out.",
                weapontype: 'r',
                rangedCombatStats: {
                    damage: 'majSt',
                    preferreddamage: 'piercingweapons',
                    weaponsmallslashing: 'majWk',
                    weaponsmallcrushing: 'majWk',
                    weaponsmallpiercing: 'majSt',
                    andslashing: 'majWk',
                    andcrushing: 'majWk',
                    flanks: 'majWk',
                    rangeddefense: 'majWk',
                    alldefense: 'minSt',
                    attack: 'minSt',
                    caution: 'noneWk',
                    fatigue: null,
                    initiative: null,
                    measure: null,
                    panic: 'noneWk',
                    rangedistance: 'majSt',
                    recovery: 'minWk',
                    largeweapons: 'minWk',
                    movement: 'majWk',
                    mental: 'minWk'
                },
                meleeCombatStats: {
                    damage: 'minWk',
                    preferreddamage: 'piercingweapons',
                    weaponsmallslashing: 'majWk',
                    weaponsmallcrushing: 'majWk',
                    weaponsmallpiercing: 'minSt',
                    andslashing: 'majWk',
                    andcrushing: 'majWk',
                    flanks: 'majWk',
                    rangeddefense: 'majWk',
                    alldefense: 'minSt',
                    attack: 'minSt',
                    caution: 'noneWk',
                    fatigue: null,
                    initiative: null,
                    measure: 'minSt',
                    panic: 'noneWk',
                    rangedistance: null,
                    recovery: 'majWk',
                    movement: 'majWk',
                    mental: 'minWk',
                    largeweapons: 'minWk',
                },
                weapons: [
                    {
                        label: 'Ranged',
                        items: ['Bellybow (P)', 'Crossbow (P)', 'Latchet Crossbow (P)', 'Longbow (P)', 'Warbow (P)']
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
                description: "Brutes are high damage and attack but low mobility making them moving threats. While easy to avoid, they'll punish any players who don't move so they can churn up the battlefield.",
                weapontype: 'm',
                rangedCombatStats: {
                    damage: 'minSt',
                    preferreddamage: 'piercingweapons',
                    weaponsmallslashing: 'majWk',
                    weaponsmallcrushing: 'majWk',
                    weaponsmallpiercing: 'majWk',
                    andslashing: 'majWk',
                    andcrushing: 'majWk',
                    flanks: 'majWk',
                    rangeddefense: 'majWk',
                    alldefense: 'majWk',
                    attack: 'minSt',
                    caution: 'minSt',
                    fatigue: 'noneWk',
                    initiative: 'minWk',
                    measure: null,
                    panic: null,
                    rangedistance: 'minSt',
                    recovery: 'majWk',
                    largeweapons: 'majSt',
                    movement: 'majWk',
                    mental: 'minWk'
                },
                meleeCombatStats: {
                    damage: 'majSt',
                    preferreddamage: 'crushingweapons',
                    weaponsmallslashing: 'majWk',
                    weaponsmallcrushing: 'majWk',
                    weaponsmallpiercing: 'majWk',
                    andslashing: 'majWk',
                    andcrushing: 'majWk',
                    flanks: 'majWk',
                    rangeddefense: 'majWk',
                    alldefense: 'majWk',
                    attack: 'majSt',
                    caution: 'minSt',
                    fatigue: 'noneWk',
                    initiative: 'minWk',
                    measure: 'minSt',
                    panic: null,
                    rangedistance: null,
                    recovery: 'majWk',
                    largeweapons: 'majSt',
                    movement: 'majWk',
                    mental: 'minWk'
                },
                weapons: [
                    {
                        label: 'Axes',
                        items: ['Bardiche (S)', 'Battle Axe (S)', 'Dane Axe (S)']
                    },
                    {
                        label: 'Polearms',
                        items: ['Ranseur (P)', 'War-scythe (P)']
                    },
                    {
                        label: 'Sidearms',
                        items: ['Dagger (P)', 'Dagger (S)']
                    },
                    {
                        label: 'Swords',
                        items: ['Zweihander (S)']
                    },
                    {
                        label: 'Trauma',
                        items: ['Club (C)', 'Mace (C)', 'Maul (C)', 'War Flail (C)', 'War Hammer (C)']
                    }
                ],
                armor: ['Chainmail', 'Plated Mail'],
                shields: [],
            },
            'Defender': {
                strengths: ['Defense', 'DR', '/DR', 'Parry', 'Parry DR', 'Parry /DR', 'Stress Threshold', 'Caution Threshold'],
                weaknesses: ['Melee Damage', 'Ranged Damage', 'Melee Attack', 'Ranged Attack', 'Ranged Penalties', 'Movement', 'Mobility Skills'],
                description: "Defenders defend. They're tanky: able to take a large amount of damage but they're unable to deal it out or effectively move around.",
                weapontype: 'm',
                rangedCombatStats: {
                    damage: 'minSt',
                    preferreddamage: 'piercingweapons',
                    alldefense: 'majWk',
                    largeweapons: null,
                    rangeddefense: 'majSt',
                    weaponsmallcrushing: 'minWk',
                    weaponsmallpiercing: 'majSt',
                    andslashing: 'minSt',
                    andcrushing: 'minWk',
                    weaponsmallslashing: 'minSt',
                    flanks: 'majSt',
                    attack: 'majWk',
                    caution: 'minWk',
                    fatigue: 'minSt',
                    initiative: 'noneWk',
                    measure: null,
                    panic: 'minSt',
                    rangedistance: 'minSt',
                    recovery: 'majWk',
                    movement: 'minWk',
                    mental: null
                },
                meleeCombatStats: {
                    damage: 'minSt',
                    preferreddamage: 'piercingweapons',
                    alldefense: 'majWk',
                    largeweapons: null,
                    rangeddefense: 'majSt',
                    weaponsmallcrushing: 'minWk',
                    weaponsmallpiercing: 'majSt',
                    andslashing: 'minSt',
                    andcrushing: 'minWk',
                    weaponsmallslashing: 'minSt',
                    flanks: 'majSt',
                    attack: 'majWk',
                    caution: 'minWk',
                    fatigue: 'minSt',
                    initiative: 'noneWk',
                    measure: 'majSt',
                    panic: 'minSt',
                    rangedistance: null,
                    recovery: 'minWk',
                    movement: 'minWk',
                    mental: null
                },
                weapons: [
                    {
                        label: 'Polearms',
                        items: ['Bill (S)', 'Guisarme (P)', 'Pike (P)']
                    },
                    {
                        label: 'Sidearms',
                        items: ['Dagger (P)', 'Dagger (S)', 'Dusack (S)']
                    },
                    {
                        label: 'Swords',
                        items: ['Arming Sword (S)', 'Court Sword (P)', 'Messer (S)', 'Sabre (S)', 'Schiavona (S)']
                    }
                ],
                armor: ['Scale', 'Laminar (Banded Mail)', 'Full Plate'],
                shields: ['Heater', 'Figure Eight', 'Kite'],
            },
            'Duelist': {
                strengths: ['Parry', 'Recovery', 'Mobility Skills', 'Stress Threshold'],
                weaknesses: ['/DR', 'Melee Damage', 'Ranged Damage', 'Range Penalties'],
                description: "The duelist is particularly good at one-on-one fights due to their fast attack and high parry but they tend to suffer from being out numbered or out ranged.",
                weapontype: 'm',
                rangedCombatStats: {
                    damage: 'majWk',
                    preferreddamage: 'piercingweapons',
                    alldefense: 'noneWk',
                    largeweapons: 'majWk',
                    rangeddefense: null,
                    weaponsmallcrushing: 'minWk',
                    weaponsmallpiercing: 'majSt',
                    andslashing: 'majSt',
                    andcrushing: 'majSt',
                    weaponsmallslashing: 'majWk',
                    flanks: 'noneWk',
                    attack: 'minWk',
                    caution: 'minSt',
                    fatigue: null,
                    initiative: 'minSt',
                    measure: null,
                    panic: 'minSt',
                    rangedistance: 'noneWk',
                    recovery: 'minSt',
                    movement: null,
                    mental: null
                },
                meleeCombatStats: {
                    damage: 'minWk',
                    preferreddamage: 'slashingweapons',
                    alldefense: 'noneWk',
                    largeweapons: 'majWk',
                    rangeddefense: null,
                    weaponsmallcrushing: 'minWk',
                    weaponsmallpiercing: 'majSt',
                    andslashing: 'majSt',
                    andcrushing: 'majSt',
                    weaponsmallslashing: 'majWk',
                    flanks: 'noneWk',
                    attack: 'minSt',
                    caution: 'minSt',
                    fatigue: null,
                    initiative: 'minSt',
                    measure: 'noneWk',
                    panic: 'minSt',
                    rangedistance: null,
                    recovery: 'majSt',
                    movement: null,
                    mental: null
                },
                weapons: [
                    {
                        label: 'Polearms',
                        items: ['Halberd (S)', 'Halberd (P)', 'Planson (P)', 'Short Spear (P)', 'Voulge (P)']
                    },
                    {
                        label: 'Sidearms',
                        items: ['Dagger (P)', 'Dagger (S)', 'Scourge (S)', 'Stiletto (P)']
                    },
                    {
                        label: 'Swords',
                        items: ['Estoc (P)', 'Longsword (S)', 'Rapier (P)']
                    },
                    {
                        label: 'Trauma',
                        items: ['Goedendag (P)', 'Quarterstaff (C)']
                    }
                ],
                armor: ['Gambeson', 'Leather'],
                shields: ['Buckler']
            },
            'Flanker': {
                strengths: ['Melee Damage', 'Recovery', 'Movement', 'Mobility Skills'],
                weaknesses: ['Defense', 'DR', '/DR', 'Ranged Damage', 'Melee Attack', 'Ranged Attack', 'Range Penalties', 'Caution Threshold'],
                description: "Flankers are mobile with high damge, however, their attack leaves something to be desired so they focus on getting around the opponent to attack from different angles.",
                weapontype: 'm',
                rangedCombatStats: {
                    damage: null,
                    preferreddamage: null,
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
                },
                meleeCombatStats: {
                    damage: null,
                    preferreddamage: null,
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
                },
                weapons: [
                    {
                        label: 'Sidearms',
                        items: ['Cinquedea (S)', 'Dagger (P)', 'Dagger (S)', 'Katzbalger (S)']
                    },
                    {
                        label: 'Trauma',
                        items: ['Bludgeon (C)']
                    }
                ],
                armor: ['Gambeson', 'Leather'],
                shields: []
            },
            'Shock': {
                strengths: ['Fatigue', 'Melee Damage', 'Measure', 'Movement', 'Mobility Skills', 'Panic Threshold', 'Caution Threshold'],
                weaknesses: ['DR', '/DR', 'Parry', 'Parry DR', 'Parry /DR', 'Ranged Damage', 'Ranged Attack', 'Recovery', 'Range Penalties'],
                description: 'First into combat and first to hit, shock monsters are great on the offensive but terrible in long, drawn out combats.',
                weapontype: 'm',
                rangedCombatStats: {
                    damage: 'majWk',
                    preferreddamage: 'piercingweapons',
                    alldefense: 'majWk',
                    largeweapons: 'minWk',
                    rangeddefense: 'majWk',
                    weaponsmallcrushing: 'majWk',
                    weaponsmallpiercing: 'majWk',
                    andslashing: 'majWk',
                    andcrushing: 'majWk',
                    weaponsmallslashing: 'majWk',
                    flanks: 'majWk',
                    attack: 'minWk',
                    caution: 'noneWk',
                    fatigue: 'majSt',
                    initiative: 'noneWk',
                    measure: null,
                    panic: 'majSt',
                    rangedistance: 'noneWk',
                    recovery: 'minSt',
                    movement: 'minSt',
                    mental: 'majWk'
                },
                meleeCombatStats: {
                    damage: 'majSt',
                    preferreddamage: 'slashingweapons',
                    alldefense: 'majWk',
                    largeweapons: 'minWk',
                    rangeddefense: 'majWk',
                    weaponsmallcrushing: 'majWk',
                    weaponsmallpiercing: 'majWk',
                    andslashing: 'majWk',
                    andcrushing: 'majWk',
                    weaponsmallslashing: 'majWk',
                    flanks: 'majWk',
                    attack: 'minSt',
                    caution: 'majSt',
                    fatigue: 'majSt',
                    initiative: 'noneWk',
                    measure: 'majSt',
                    panic: 'majSt',
                    rangedistance: null,
                    recovery: 'majWk',
                    movement: 'minSt',
                    mental: 'majWk'
                },
                weapons: [
                    {
                        label: 'Axes',
                        items: ['Dane Axe (S)', 'Horseman\'s pick (P)', 'Lochaber Axe (S)']
                    },
                    {
                        label: 'Polearms',
                        items: ['Glaive (S)', 'Lance (P)', 'Lucerne (C)', 'Sovnya (S)']
                    },
                    {
                        label: 'Sidearms',
                        items: ['Dagger (P)', 'Dagger (S)']
                    },
                    {
                        label: 'Swords',
                        items: ['Executioner\'s Sword (S)', 'Falchion (S)', 'Koncerz (P)']
                    },
                    {
                        label: 'Trauma',
                        items: ['Bec De Corbin (C)', 'Great Hammer (C)', 'Peasant\'s Flail (C)']
                    }
                ],
                armor: ['Coat of Plates'],
                shields: []
            },
            'Skirmisher': {
                strengths: ['Ranged Attack', 'Movement', 'Mobility Skills', 'Stress Threshold', 'Panic'],
                weaknesses: ['DR', '/DR', 'Parry', 'Parry DR', 'Parry /DR', 'Melee Damage', 'Ranged Damage', 'Melee Attack', 'Caution Threshold'],
                description: 'Fast on their feet, the skirmisher focuses on hit-and-run tactics, although their focus on ranged combat makes them squishy in melee.',
                weapontype: 'r',
                rangedCombatStats: {
                    damage: 'minWk',
                    preferreddamage: 'piercingweapons',
                    alldefense: 'minWk',
                    largeweapons: 'majWk',
                    rangeddefense: 'minSt',
                    weaponsmallcrushing: 'majWk',
                    weaponsmallpiercing: 'majWk',
                    andslashing: 'majWk',
                    andcrushing: 'majWk',
                    weaponsmallslashing: 'majWk',
                    flanks: 'majWk',
                    attack: 'majSt',
                    caution: 'noneWk',
                    fatigue: null,
                    initiative: 'minSt',
                    measure: null,
                    panic: null,
                    rangedistance: 'majWk',
                    recovery: 'majSt',
                    movement: 'majSt',
                    mental: 'minSt'
                },
                meleeCombatStats: {
                    damage: 'minSt',
                    preferreddamage: 'slashingweapons',
                    alldefense: 'minWk',
                    largeweapons: 'majWk',
                    rangeddefense: 'minSt',
                    weaponsmallcrushing: 'majWk',
                    weaponsmallpiercing: 'majWk',
                    andslashing: 'majWk',
                    andcrushing: 'majWk',
                    weaponsmallslashing: 'majWk',
                    flanks: 'majWk',
                    attack: 'minSt',
                    caution: 'noneWk',
                    fatigue: null,
                    initiative: 'minSt',
                    measure: 'minSt',
                    panic: null,
                    rangedistance: null,
                    recovery: 'majWk',
                    movement: 'majSt',
                    mental: 'minSt'
                },
                weapons: [
                    {
                        label: 'Axes',
                        items: ['Handaxe (S)']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Javelin (P)', 'Short Spear (P)']
                    },
                    {
                        label: 'Ranged',
                        items: ['Composite Bow (P)', 'Javelin (P)', 'Sling (C)', 'Throwing Axe (S)', 'Throwing Knife (P)']
                    },
                    {
                        label: 'Sidearms',
                        items: ['Dagger (P)', 'Dagger (S)', 'Knife (S)']
                    }
                ],
                armor: ['Gambeson', 'Leather'],
                shields: ['Buckler'],
            }
        },
    }
}