export default {
    skillRoles: {
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
            ]
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
            ]
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
            ]
        },
        'Lock': {
            strengths: 'Extremely powerful most of the time.',
            weaknesses: 'Once their Skill Challenge is beaten, usually extremely weak.',
            skillList: null
        },
        'Conditional': {
            strengths: 'Extremely dangerous.',
            weaknesses: 'Only dangerous under specific circumstances.',
            skillList: null
        },
        'Antagonist': {
            strengths: 'Debuffs enemies and buffs their allies.',
            weaknesses: 'Only effective indirectly.',
            skillList: null
        },
        'Trap': {
            strengths: 'Hidden and can be crippling or damaging. Often evolve into another type of encounter.',
            weaknesses: 'Cannot move or adapt. Can be easily avoided',
            skillList: null
        },
        'Hazard': {
            strengths: 'Extremely crippling and/or damaging.',
            weaknesses: 'Non-hidden. Can be easily avoided or bypassed. Often non-mobile.',
            skillList: null
        },
    },
    skillList: [
        {
            label: 'Skill Suites',
            skillList: ['Athletics', 'Lore', 'Streetwise', 'Survival', 'Tactics', 'Trades', 'Weirdcraft']
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
            label: 'Tactics',
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
        'Striker': {
            strengths: ['Offensive', 'Many Characteristics'],
            weaknesses: ['Defensive', 'Weak Characteristics']
        },
        'Defender': {
            strengths: ['Defensive', 'Powerful Characteristics'],
            weaknesses: ['Offensive', 'Few Characteristics']
        },
        'Support': {
            strengths: ['Buffing Others', 'Debuffing Others'],
            weaknesses: ['Being Alone']
        },
        'Feinter': {
            strengths: ['Longer Confrontations', 'Evidence', 'Using Enemids\ Characteristics Against Them'],
            weaknesses: ['Shorter Confrontations']
        },
        'Fast-Talker': {
            strengths: ['Shorter Confrontations'],
            weaknesses: ['Longer Confrontations']
        },
        'Sandbagger': {
            strengths: ['Longer Confrontations', 'Inflicting Stress'],
            weaknesses: ['None']
        },
        'Corruptor': {
            strengths: ['Stress Threshold', 'Flexible Characteristics'],
            weaknesses: ['Weak Characteristics']
        },
        'Gaslighter': {
            strengths: ['Debuffing Others', 'Stress Threshold'],
            weaknesses: ['Weak Characteristics', 'Few Characteristics']
        },
        'Enabler': {
            strengths: ['Buffing Others', 'Using Enemids\ Characteristics Against Them'],
            weaknesses: ['None']
        },
        'Opportunist': {
            strengths: ['Capitalzing on Weaknesses'],
            weaknesses: ['None']
        },
    },
    combatRoles: {
        primary: {
            'Artillery': {
                strengths: ['Vitality', 'Ranged Damage', 'Ranged Attack', 'Ranged Penalties'],
                weaknesses: ['/DR', 'Parry', 'Parry DR', 'Parry /DR', 'Melee Damage', 'Melee Attack', 'Recovery', 'Movement', 'Caution Threshold'],
                vitality: 30,
                fatigue: 25,
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
                weapons: [
                    {
                        label: 'Preferred Choices',
                        items: ['Longbow', 'Dagger']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Crossbow', 'Bellybow']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['Warbow', 'Sling']
                    }
                ],
                armor: [
                    {
                        label: 'Preferred Choice',
                        items: ['None']
                    },
                    {
                        label: 'Neutral Choice',
                        items: ['Buff Coat']
                    }
                ],
                shields: [{
                    label: 'Not Preferred Choice',
                    items: ['Buckler']
                }]
            },
            'Brute': {
                strengths: ['Vitality', 'Melee Damage', 'Melee Attack', 'Caution Threshold'],
                weaknesses: ['Defense', 'Parry', 'Parry DR', 'Parry /DR', 'Ranged Damage', 'Ranged Attack', 'Recovery', 'Ranged Penalties', 'Movement', 'Mobility Skills'],
                vitality: 80,
                fatigue: 50,
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
                weapons: [
                    {
                        label: 'Preferred Choices',
                        items: ['Bardiche', 'Zweihander']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Bec De Corbin', 'Ranseur']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['Peasant\'s Flail', 'Lucerne']
                    }
                ],
                armor: [
                    {
                        label: 'Preferred Choice',
                        items: ['Chainmail']
                    },
                    {
                        label: 'Neutral Choice',
                        items: ['Plated Mail']
                    },
                ],
                shields: [],
            },
            'Defender': {
                strengths: ['Defense', 'DR', '/DR', 'Parry', 'Parry DR', 'Parry /DR', 'Stress Threshold', 'Caution Threshold'],
                weaknesses: ['Melee Damage', 'Ranged Damage', 'Melee Attack', 'Ranged Attack', 'Ranged Penalties', 'Movement', 'Mobility Skills'],
                vitality: 40,
                fatigue: 25,
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
                weapons: [
                    {
                        label: 'Preferred Choices',
                        items: ['Longsword', 'Dagger']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Court Sword', 'War Hammer']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['War Flail', 'Short Spear']
                    }
                ],
                armor: [
                    {
                        label: 'Preferred Choice',
                        items: ['Scale']
                    },
                    {
                        label: 'Neutral Choice',
                        items: ['Laminar']
                    },
                    {
                        label: 'Not Preferred Choice',
                        items: ['Full Plate']
                    }
                ],
                shields: [
                    {
                        label: 'Preferred Choice',
                        items: ['Heater']
                    },
                    {
                        label: 'Neutral Choice',
                        items: ['Figure Eight']
                    },
                    {
                        label: 'Not Preferred Choice',
                        items: ['Kite']
                    }
                ],
            },
            'Fencer': {
                strengths: ['Parry', 'Recovery', 'Mobility Skills', 'Stress Threshold'],
                weaknesses: ['/DR', 'Melee Damage', 'Ranged Damage', 'Range Penalties'],
                vitality: 30,
                fatigue: 25,
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
                weapons: [
                    {
                        label: 'Preferred Choices',
                        items: ['Rapier', 'Stiletto']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Messer', 'Court Sword', 'Estoc']
                    },
                    {
                        label: 'Not Preferred Choice',
                        items: ['Military Fork']
                    }
                ],
                armor: [
                    {
                        label: 'Preferred Choice',
                        items: ['Gambeson']
                    },
                    {
                        label: 'Not Preferred Choice',
                        items: ['Leather']
                    }
                ],
                shields: [
                    {
                        label: 'Neutral Choice',
                        items: ['Buckler']
                    },
                ]
            },
            'Flanker': {
                strengths: ['Melee Damage', 'Recovery', 'Movement', 'Mobility Skills'],
                weaknesses: ['Defense', 'DR', '/DR', 'Ranged Damage', 'Melee Attack', 'Ranged Attack', 'Range Penalties', 'Caution Threshold'],
                vitality: 30,
                fatigue: 25,
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
                weapons: [
                    {
                        label: 'Preferred Choices',
                        items: ['Knife', 'Throwing Knife', 'Dagger']
                    },
                    {
                        label: 'Neutral Choice',
                        items: ['Katzbalger']
                    },
                    {
                        label: 'Not Preferred Choice',
                        items: ['Bludgeon']
                    }
                ],
                armor: [
                    {
                        label: 'Preferred Choice',
                        items: ['Gambeson']
                    },
                    {
                        label: 'Neutral Choice',
                        items: ['Leather']
                    },
                ],
                shields: []
            },
            'Fodder': {
                strengths: ['Melee Damage', 'Ranged Damage', 'Melee Attack', 'Mobility Skills'],
                weaknesses: ['Vitality', 'Fatigue', '/DR', 'DR', 'Parry', 'Parry DR', 'Parry /DR', 'Movement', 'Stress Threshold', 'Panic Threshold', 'Caution Threshold'],
                vitality: 15,
                fatigue: 1,
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
                weapons: [
                    {
                        label: 'Preferred Choices',
                        items: ['Pishaq', 'Handaxe', 'Throwing Axe']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['Bludgeon', 'Club', 'Short Spear', 'Sling']
                    }
                ],
                armor: [
                    {
                        label: 'Preferred Choice',
                        items: ['None']
                    },
                    {
                        label: 'Not Preferred Choice',
                        items: ['Buff coat']
                    }
                ],
                shields: [
                    {
                        label: 'Neutral Choice',
                        items: ['Clothe']
                    }
                ],
            },
            'Shock': {
                strengths: ['Fatigue', 'Melee Damage', 'Measure', 'Movement', 'Mobility Skills', 'Panic Threshold', 'Caution Threshold'],
                weaknesses: ['DR', '/DR', 'Parry', 'Parry DR', 'Parry /DR', 'Ranged Damage', 'Ranged Attack', 'Recovery', 'Range Penalties'],
                vitality: 40,
                fatigue: 25,
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
                weapons: [
                    {
                        label: 'Preferred Choice',
                        items: ['Maul']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Glaive', 'Lucerne']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['Zweihander', 'Lochaber Axe']
                    }
                ],
                armor: [
                    {
                        label: 'Preferred Choice',
                        items: ['Coat of Plates']
                    },
                    {
                        label: 'Neutral Choice',
                        items: ['None']
                    }
                ],
                shields: []
            },
            'Skirmisher': {
                strengths: ['Ranged Attack', 'Movement', 'Mobility Skills', 'Stress Threshold', 'Panic'],
                weaknesses: ['DR', '/DR', 'Parry', 'Parry DR', 'Parry /DR', 'Melee Damage', 'Ranged Damage', 'Melee Attack', 'Caution Threshold'],
                vitality: 30,
                fatigue: 25,
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
                weapons: [
                    {
                        label: 'Preferred Choices',
                        items: ['Knife', 'Throwing Knife', 'Handaxe', 'Throwing Axe']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Javelin', 'Short Spear']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['Handgonne', 'Sling']
                    }
                ],
                armor: [
                    {
                        label: 'Preferred Choice',
                        items: ['None']
                    },
                    {
                        label: 'Neutral Choice',
                        items: ['Gambeson']
                    },
                    {
                        label: 'Not Preferred Choice',
                        items: ['Leather']
                    }
                ],
                shields: [
                    {
                        label: 'Not Preferred Choice',
                        items: ['Buckler']
                    }
                ],
            }
        }
    }
}