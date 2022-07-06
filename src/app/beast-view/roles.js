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
            skillList: ['Athletics Skill Suite', 'Lore Skill Suite', 'Streetwise Skill Suite', 'Survival Skill Suite', 'Tactics Skill Suite', 'Trades Skill Suite', 'Weirdcraft Skill Suite']
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
            weaknesses: ['Defensive', 'Weak Characteristics'],
            description: "A Strike has many Characteristics that are weak; this allows them to have a lot of avenues to convince others, looking for a soft spot, but unable to really fight off someone attacking them."
        },
        'Defender': {
            strengths: ['Defensive', 'Powerful Characteristics'],
            weaknesses: ['Offensive', 'Few Characteristics'],
            description: "A Defender is stauch in their beliefs and often unmoveable but, because of this specialization, they're rarely able to actually go on the offensive to convince others."
        },
        'Support': {
            strengths: ['Buffing Others', 'Debuffing Others'],
            weaknesses: ['Being Alone'],
            description: "Support is all about buffing their own team and debuffing the others; Giving bonuses to their friends and penalties to their enemies."
        },
        'Feinter': {
            strengths: ['Longer Confrontations', 'Evidence', 'Using Enemies\ Characteristics Against Them'],
            weaknesses: ['Shorter Confrontations'],
            description: "A Feinter thrives in shorter Confrontations as they tend to wait until the enemy has got enough rope to hang themselves. Often they have powers that allow them to quickly glean their enemy's Characteristics."
        },
        'Fast-Talker': {
            strengths: ['Shorter Confrontations', 'Powerful Characteristics', 'Ways to get points beyond Checks'],
            weaknesses: ['Longer Confrontations'],
            description: "Faster-Talkers are all about getting a lot of points really early so that they can override any remaining concerns you have without having to directly address them."
        },
        'Sandbagger': {
            strengths: ['Longer Confrontations', 'Inflicting Stress'],
            weaknesses: ['None'],
            description: "Sandbaggers start off weak but gain more power the longer the Confrontation goes on, often relying on enemies underestimating them to stay in the back until they're ready to strike."
        },
        'Corruptor': {
            strengths: ['Stress Threshold', 'Flexible Characteristics'],
            weaknesses: ['Weak Characteristics'],
            description: "A Corrupter is often weak but they're presistent, often wearing away at an enemy's Stress Threshold and, possibly, changing who they are."
        },
        'Gaslighter': {
            strengths: ['Debuffing Others', 'Stress Threshold'],
            weaknesses: ['Weak Characteristics', 'Few Characteristics'],
            description: "Gaslighters are weak on their own but they debuff others can, with a high Stress Threshold, can simply out last others in a straigh up slugging match."
        },
        'Enabler': {
            strengths: ['Buffing Others', 'Using Enemids\ Characteristics Against Them'],
            weaknesses: ['None'],
            description: "Enablers are power for a price: enables can either buff their own team but also can buff the enemy only for the buff to come at a cost."
        },
        'Opportunist': {
            strengths: ['Capitalzing on Weaknesses'],
            weaknesses: ['None'],
            description: "An Opportunist waits for their enemy to become Fatigued or Stressed before pouncing; often they have abilities they make them more powerful when their enemy has those conditions."
        },
    },
    combatRoles: {
        primary: {
            'Artillery': {
                strengths: ['Vitality', 'Ranged Damage', 'Ranged Attack', 'Ranged Penalties'],
                weaknesses: ['/DR', 'Parry', 'Parry DR', 'Parry /DR', 'Melee Damage', 'Melee Attack', 'Recovery', 'Movement', 'Caution Threshold'],
                description: "Artillery have high ranged attack and damage which means that they can threaten anyone on the battlefield, however, their low mobility and melee abilities means that they can often be charged down and taken out.",
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
                        items: ['Longbow (P)', 'Dagger (S)', 'Dagger (P)']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Crossbow (P)', 'Bellybow (P)']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['Warbow (P)', 'Sling (C)']
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
                description: "Brutes are high damage and attack but low mobility making them moving threats. While easy to avoid, they'll punish any players who don't move so they can churn up the battlefield.",
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
                        items: ['Bardiche (S)', 'Zweihander (S)']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Bec De Corbin (C)', 'Ranseur (P)']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['Peasant\'s Flail (C)', 'Lucerne (C)']
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
                description: "Defenders defend. They're tanky: able to take a large amount of damage but they're unable to deal it out or effectively move around.",
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
                        items: ['Longsword (S)', 'Dagger (S)', 'Dagger (P)']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Court Sword (P)', 'War Hammer (C)']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['War Flail (C)', 'Short Spear (P)']
                    }
                ],
                armor: [
                    {
                        label: 'Preferred Choice',
                        items: ['Scale']
                    },
                    {
                        label: 'Neutral Choice',
                        items: ['Laminar (Banded Mail)']
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
                description: "The fencer is particularly good at one-on-one fights due to their fast attack and high parry but they tend to suffer from being out numbered or out ranged.",
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
                        items: ['Rapier (P)', 'Stiletto (S)']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Messer (S)', 'Court Sword (P)', 'Estoc (P)']
                    },
                    {
                        label: 'Not Preferred Choice',
                        items: ['Military Fork (P)']
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
                description: "Flankers are mobile with high damge, however, their attack leaves something to be desired so they focus on getting around the opponent to attack from different angles.",
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
                        items: ['Knife (S)', 'Throwing Knife (S)', 'Dagger (S)', 'Dagger (P)']
                    },
                    {
                        label: 'Neutral Choice',
                        items: ['Katzbalger (S)']
                    },
                    {
                        label: 'Not Preferred Choice',
                        items: ['Bludgeon (C)']
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
                description: "Fooder are good at dealing damage, both melee and ranged, making them versitile but they lack defenses, making them easier to dispatch.",
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
                        items: ['Pishaq (S)', 'Handaxe (S)', 'Throwing Axe (S)']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['Bludgeon (C)', 'Club (C)', 'Short Spear (P)', 'Sling (C)']
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
                description: 'First into combat and first to hit, shock monsters are great on the offensive but terrible in long, drawn out combats.',
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
                        items: ['Maul (C)']
                    }, 
                    {
                        label: 'Neutral Choices',
                        items: ['Glaive (S)', 'Lucerne (C)']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['Zweihander (S)', 'Lochaber Axe']
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
                description: 'Fast on their feet, the skirmisher focuses on hit-and-run tactics, although their focus on ranged combat makes them squishy in melee.',
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
                        items: ['Knife (S)', 'Throwing Knife (S)', 'Handaxe (S)', 'Throwing Axe (S)']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Javelin (P)', 'Short Spear (P)']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['Handgonne (C)', 'Sling (C)']
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