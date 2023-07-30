export default {
    skillRoles: {
        'Fodder': {
            strengths: 'None.',
            weaknesses: 'All of them.',
            skillList: [
                {
                    label: 'Preferred Choices',
                    skillList: []
                },
                {
                    label: 'Neutral Choices',
                    skillList: []
                },
                {
                    label: 'Not Preferred Choices',
                    skillList: []
                }
            ],
            description: "Skill Fodder are just not good at Skill Challenges and roll a d20! for all rules by default."
        },
        'Hunter': {
            strengths: 'Keeps distance, waiting for the perfect time to strike.',
            weaknesses: 'Weak outside of when they strike.',
            skillList: [
                {
                    label: 'Preferred Choices',
                    skillList: ['Acrobatics', 'Endurance', 'Hunting', 'Jumping', 'Move Silently', 'Perception', 'Snaring']
                },
                {
                    label: 'Neutral Choices',
                    skillList: ['Climbing', 'Listening', 'Navigation', 'Occultism', 'Swimming']
                },
                {
                    label: 'Not Preferred Choices',
                    skillList: ['Animism', 'Distraction', 'Escape Artist', 'Riding', 'Use Rope', 'World Craft']
                }
            ],
            description: "Hunters keep their prey at a distance until it's time to strike. They use their Skills to pick their moment of engagement, a moment where they're exceptionally powerful."
        },
        'Prey': {
            strengths: 'Keeps distance, indirectly attacking enemies, possibly crippling them.',
            weaknesses: 'Always weak.',
            skillList: [
                {
                    label: 'Preferred Choices',
                    skillList: ['Acrobatics', 'Climbing', 'Deception', 'Distraction', 'Endurance', 'Escape Artist', 'Listening']
                },
                {
                    label: 'Neutral Choices',
                    skillList: ['Animism', 'Glamour', 'Hiding', 'Jumping', 'Move Silently', 'Swimming']
                },
                {
                    label: 'Not Preferred Choices',
                    skillList: ['Intuition', 'Navigation', 'Occultism', 'Perception', 'Riding', 'Current Affairs']
                }
            ],
            description: "Prey keeps their distance with Skills based around movement. They're usually extremely weak when caught but can often use the terrain to their advantage."
        },
        'Controller': {
            strengths: 'Move enemies around using Skills.',
            weaknesses: 'None.',
            skillList: [
                {
                    label: 'Preferred Choices',
                    skillList: ['Administration', 'Distraction', 'Intuition', 'Language', 'Perception', 'Performance']
                },
                {
                    label: 'Neutral Choices',
                    skillList: ['Glamour', 'Occultism', 'Rally']
                },
                {
                    label: 'Not Preferred Choices',
                    skillList: ['Calling', 'Charm', 'Forgery', 'Signalling', 'Warfare']
                }
            ],
            description: "A Controller uses their Skills to move players around, either on a battlefield or on an overland map."
        },
        'Lock': {
            strengths: 'Extremely powerful most of the time.',
            weaknesses: 'Once their Skill Challenge is beaten, usually extremely weak.',
            skillList: null,
            description: "Locks are those enemies that can only be beaten after a Skill Challenge. They're usually extremely powerful and/or invulnerable until after, at which point they become a pushover."
        },
        'Antagonist': {
            strengths: 'Debuffs enemies and buffs their allies.',
            weaknesses: 'Only effective indirectly.',
            skillList: null,
            description: "Antagonists are effective indirectly and focus on applying penalities to the enemy, rather than actually being skilled."
        },
        'Trap': {
            strengths: 'Hidden and can be crippling or damaging. Often evolve into another type of encounter.',
            weaknesses: 'Cannot move or adapt. Can be easily avoided',
            skillList: null,
            description: "Traps are hidden, making them a nasty surprise to punish the unwary, however, they're also dumb, only being a threat when triggered."
        },
        'Hazard': {
            strengths: 'Extremely crippling and/or damaging.',
            weaknesses: 'Non-hidden. Can be easily avoided or bypassed. Often non-mobile.',
            skillList: null,
            description: "Hazards are extremely powerful, however, they're non-moving and non-hidden, meaning that they're easily avoided."
        },
    },
    skillList: [
        {
            label: 'Skill Suites',
            skillList: ['Athletics Skill Suite', 'Lore Skill Suite', 'Streetwise Skill Suite', 'Survival Skill Suite', 'Strategy Skill Suite', 'Trades Skill Suite', 'Weirdcraft Skill Suite']
        },
        {
            label: 'Athletics',
            skillList: ['Acrobatics', 'Climbing', 'Endurance', 'Escape Artist', 'Jumping', 'Move Silently', 'Sport', 'Swimming', 'Vandalism']
        },
        {
            label: 'Lore',
            skillList: ['Administration', 'History', 'Language', 'Law', 'Literacy', 'Mathematics', 'Medicine', 'Monster Craft', 'Religion', 'World Craft']
        },
        {
            label: 'Streetwise',
            skillList: ['Current Affairs', 'Deception', 'Forgery', 'Gambling/Gaming', 'Intuition', 'Listening', 'Lock Picking', 'Perception', 'Slight of Hand']
        },
        {
            label: 'Survival',
            skillList: ['Botany', 'Fire Building', 'First Aid', 'Handle Animal', 'Hiding', 'Monster Craft', 'Navigation', 'Scavenging', 'Snaring', 'Hunting', 'Use Rope']
        },
        {
            label: 'Strategy',
            skillList: ['Combat Style', 'Distraction', 'Leadership', 'Quarter Mastering', 'Rally', 'Recruiting', 'Riding', 'Signalling', 'Warfare']
        },
        {
            label: 'Trades',
            skillList: ['Appraisal', 'Articulation', 'Artistry', 'Cooking/Baking', 'Craft', 'Leatherworking', 'Maintenance', 'Metalworking', 'Musician', 'Performance']
        },
        {
            label: 'Weirdcraft',
            skillList: ['Animism', 'Calling', 'Charm', 'Glamour', 'Investiture', 'Occultism', 'Sortilege']
        }
    ],
    socialRoles: {
        primary: {
            'Fodder': {
                strengths: 'None.',
                weaknesses: 'All of them.',
                description: "Confrontation Fodder are just not good at Confrontations and roll a d20! for all rules by default."
            },
            'Striker': {
                strengths: ['Offensive', 'Many Characteristics'],
                weaknesses: ['Defensive', 'Weak Characteristics'],
                description: "Strikers have many Characteristics that are weak, with low Ranks."
            },
            'Defender': {
                strengths: ['Defensive', 'Powerful Characteristics'],
                weaknesses: ['Offensive', 'Few Characteristics'],
                description: "Defenders have a high Stress Threshold but few Characteristics, which are mostly Devotions. However, what Characteristics they do have have very high Ranks."
            },
            'Support': {
                strengths: ['Buffing Others', 'Debuffing Others'],
                weaknesses: ['Being Alone'],
                description: "Supports have lots of Descriptions and Devotions but no Convictions and all their Characteristics have low Ranks. They also have low Stress Thresholds."
            },
            'Corruptor': {
                strengths: ['Stress Threshold', 'Flexible Characteristics'],
                weaknesses: ['Weak Characteristics'],
                description: "Corruptors have high or non-existent Stress Thresholds but very low Ranks and very few Characteristics."
            },
            'Gaslighter': {
                strengths: ['Debuffing Others', 'Stress Threshold'],
                weaknesses: ['Weak Characteristics', 'Few Characteristics'],
                description: "Gaslighters have non-existent Characteristics but they also have a high Intuition which allows them to read their enemies and use their Characteristics."
            },
            'Enabler': {
                strengths: ['Buffing Others', 'Using Enemids\ Characteristics Against Them'],
                weaknesses: ['None'],
                description: "Enablers are power for a price: enables can either buff their own team but also can buff the enemy only for the buff to come at a cost."
            },
            'Opportunist': {
                strengths: ['Capitalzing on Weaknesses'],
                weaknesses: ['None'],
                description: "Opportunists have low Stress Thresholds but high Characteristics so they can win a single Check easily but don't do well in drawn out encounters."
            },
            'Know-It-All': {
                description: 'Know-it-alls are Skill-based. They roll a d12! when using Characteristics on a Confrontation Check but a d20! when using a Skill for a Confrontation Check.'
            },
            'Dialectician': {
                description: 'Dialecticians are Evidence-based. They receive some sort of bonus if they present Evidence during a Confrontation.'
            }
        },
        secondary: {
            'Feinter': {
                strengths: ['Longer Confrontations', 'Evidence', 'Using Enemies\ Characteristics Against Them'],
                weaknesses: ['Shorter Confrontations'],
                description: "Feinters become stronger as they lose the Confrontation. This can mean receiving a bonus the most Stress they have or the more points the enemy has."
            },
            'Fast-Talker': {
                strengths: ['Shorter Confrontations', 'Powerful Characteristics', 'Ways to get points beyond Checks'],
                weaknesses: ['Longer Confrontations'],
                description: "Faster-Talkers are good at the start of the Confrontation but become weaker as it goes on. This usually means a large bonus that diminishes as the Confrontation goes on."
            },
            'Sandbagger': {
                strengths: ['Longer Confrontations', 'Inflicting Stress'],
                weaknesses: ['None'],
                description: "Sandbaggers are good as the Confrontation drags on. This usually means a bonus that grows each Check or a threshold that, when met, gives them a huge bonus."
            }
        }
    },
    combatRoles: {
        primary: {
            'Artillery': {
                strengths: ['Vitality', 'Ranged Damage', 'Ranged Attack', 'Ranged Penalties'],
                weaknesses: ['/DR', 'Parry', 'Parry DR', 'Parry /DR', 'Melee Damage', 'Melee Attack', 'Recovery', 'Movement', 'Caution Threshold'],
                description: "Artillery have high ranged attack and damage which means that they can threaten anyone on the battlefield, however, their low mobility and melee abilities means that they can often be charged down and taken out.",
                combatStats: {
                    damage: 'majSt',
                    preferreddamage: 'piercingweapons',
                    weaponsmallslashing: 'majWk',
                    weaponsmallcrushing: 'majWk',
                    weaponsmallpiercing: 'majSt',
                    andslashing: 'majWk',
                    andcrushing: 'majWk',
                    flanks: 'majWk',
                    rangeddefense: 'majWk',
                    all: 'minSt',
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
                spdbonus: 3,
                vitality: '1d10 + 25',
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
                combatStats: {
                    damage: 'majSt',
                    preferreddamage: 'crushingweapons',
                    weaponsmallslashing: 'majWk',
                    weaponsmallcrushing: 'majWk',
                    weaponsmallpiercing: 'majWk',
                    andslashing: 'majWk',
                    andcrushing: 'majWk',
                    flanks: 'majWk',
                    rangeddefense: 'majWk',
                    all: 'majWk',
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
                spdbonus: 2,
                vitality: '2d20 + 60',
                fatigue: 'W',
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
                combatStats: {
                    damage: 'minSt',
                    preferreddamage: 'piercingweapons',
                    all: 'majWk',
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
                spdbonus: 0,
                vitality: '(1d10 *4) + 20',
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
                combatStats: {
                    damage: 'minWk',
                    preferreddamage: 'slashingweapons',
                    all: 'noneWk',
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
                spdbonus: -3,
                vitality: '1d10 + 25',
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
                combatStats: {
                    damage: null,
                    preferreddamage: null,
                    all: null,
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
                spdbonus: -1,
                vitality: '1d10 + 25',
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
                combatStats: {
                    damage: 'majSt',
                    preferreddamage: 'slashingweapons',
                    all: 'majWk',
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
                spdbonus: 4,
                vitality: '(1d10 * 4) + 20',
                fatigue: "C",
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
                combatStats: {
                    damage: 'minWk',
                    preferreddamage: 'piercingweapons',
                    all: 'minWk',
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
                    rangedistance: 'noneWk',
                    recovery: 'majSt',
                    movement: 'majSt',
                    mental: 'minSt'
                },
                spdbonus: 0,
                vitality: '1d10 + 25',
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
        secondary: {
            'Fodder': {
                description: 'Fodder aren\'t fighters and don\'t do well on the battlefield. While they may mimic a role\'s strategies, they are weak, having half the expected Vitality.'
            },
            'Captain': {
                description: 'Captains are all about morale and buffing others. They work best when paired with other roles.',
            },
            'Controller': {
                description: 'Controllers are about movement: pushing and pulling others on the battlefield to get them into position.',
                weapons: [
                    {
                        label: 'Controller Weapons',
                        items: ['Ahlspiess (P)', 'Military Fork (P)', 'Brass Knuckles (C)', 'Unarmed (C)', 'Fire Lance (C)', 'Hakenbuchse (C)', 'Handgonne (C)']
                    },
                ]
            },
            'Solo': {
                description: 'Solos fight alone against the party. They have special abilities that keep them dangerous and the fight interesting.',
            }
        }
    }
}