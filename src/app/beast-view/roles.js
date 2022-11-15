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
            description: "Skill Fodder are just not good at Skill Challenges and roll a d12! for all rules by default."
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
        'Conditional': {
            strengths: 'Extremely dangerous.',
            weaknesses: 'Only dangerous under specific circumstances.',
            skillList: null,
            description: "A Conditional enemy is one that is extremely powerful but only under certain conditions. Often they'll also have immunities that must be discovered to truly hurt them."
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
                description: "Confrontation Fodder are just not good at Confrontations and roll a d12! for all rules by default."
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
                description: "Feinters become as they lose the Confrontation. This can mean receiving a bonus the most Stress they have or the more points the enemy has."
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
                description: "Brutes are high damage and attack but low mobility making them moving threats. While easy to avoid, they'll punish any players who don't move so they can churn up the battlefield.",
                spdbonus: 2,
                vitality: 80,
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
                description: "Defenders defend. They're tanky: able to take a large amount of damage but they're unable to deal it out or effectively move around.",
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
                description: "The duelist is particularly good at one-on-one fights due to their fast attack and high parry but they tend to suffer from being out numbered or out ranged.",
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
                        items: ['Estock', 'Longsword', 'Rapier']
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
                description: "Flankers are mobile with high damge, however, their attack leaves something to be desired so they focus on getting around the opponent to attack from different angles.",
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
                description: "Fooder are good at dealing damage, both melee and ranged, making them versitile but they lack defenses, making them easier to dispatch.",
                spdbonus: 0,
                vitality: 15,
                fatigue: "H",
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
                description: 'First into combat and first to hit, shock monsters are great on the offensive but terrible in long, drawn out combats.',
                spdbonus: 4,
                vitality: 40,
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
                description: 'Fast on their feet, the skirmisher focuses on hit-and-run tactics, although their focus on ranged combat makes them squishy in melee.',
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
        },
        secondary: {
            'Captain': {
                description: 'Captains are all about morale and buffing others. They work best when paired with other roles.',
            },
            'Controller': {
                description: 'Controllers are about movement: pushing and pulling others on the battlefield to get them into position.',
            },
            'Solo': {
                description: 'Solos fight alone against the party. They have special abilities that keep them dangerous and the fight interesting.',
            }
        }
    }
}