export default {
    staticValues: {
        a: "d4!-4",
        b: "d6!-6",
        c: "d10!-7",
        d: "d10!-5",
        e: "d10!-1",
        f: "d3!*10",
        g: "3d10!*10",
        h: "d100! + 100",
        i: "2d100! + 200",
        j: "6d100! + 400"
    },
    numberAppearing: {
        a: "d4!-8",
        b: "d4!-4",
        c: "d2!-4",
        d: "d2!-2",
        e: "d2!-1",
        f: "d4!-1",
        g: "d6!-1",
        h: "d8!-1",
        i: "d10!-1",
        j: "d12!-1",
        k: "d20!-1"
    },
    traitedChance: {
        a: [5],
        b: [5, 10],
        c: [5, 10, 25, 35],
        d: [5, 10, 25, 35, 45, 55],
        e: [5, 10, 25, 35, 45, 55, 65, 75],
        f: [5, 10, 25, 35, 45, 55, 65, 75, 85],
        g: [5, 10, 25, 35, 45, 55, 65, 75, 85, 90],
        h: [1, 5, 10, 25, 35, 45, 55, 65, 75, 85, 90, 100],
        i: [5, 10, 15, 35, 45, 55, 65, 75, 85, 95, 100, 100],
        j: [10, 20, 35, 45, 55, 65, 75, 85, 95, 100, 100, 100],
        k: [15, 35, 45, 55, 65, 75, 85, 95, 100, 100, 100, 100]
    },
    traitDice: ['+2', '+4', '+6', '+8', '+10', '+12', '+14', '+16', '+18', '+20', '+22', '+24'],
    relicTable: {
        a: {minor: 1, middling: 0},
        b: {minor: 5, middling: 0},
        c: {minor: 10, middling: 1},
        d: {minor: 15, middling: 5},
        e: {minor: 20, middling: 10},
        f: {minor: 25, middling: 15},
        g: {minor: 30, middling: 20}
    },
    enchantedTable: {
        a: {minor: 1, middling: 0},
        b: {minor: 5, middling: 0},
        c: {minor: 10, middling: 1},
        d: {minor: 15, middling: 5},
        e: {minor: 20, middling: 10},
        f: {minor: 25, middling: 15},
        g: {minor: 30, middling: 20}
    },
    scrollPower: {
        a: "6+d4",
        b: "7+2d4",
        c: "9+3d4",
        d: "12+2d6",
        e: "16+2d6",
    }, 
    almsFavor: {
        a: "d2",
        b: "d3",
        c: "d4",
        d: "d6",
        e: "d8",
        f: "d10",
        g: "d12"
    }
}