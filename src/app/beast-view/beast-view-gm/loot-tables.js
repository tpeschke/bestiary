export default {
    staticValues: {
        a: "d10-1",
        b: "d3*10",
        c: "3d10*10",
        d: "d100 + 100",
        e: "2d100 + 200",
        f: "6d100 + 400"
    },
    numberAppearing: {
        a: "1",
        b: "d2",
        c: "d3",
        d: "d4",
        e: "d6",
        f: "d8"
    },
    traitedChance: {
        a: [5],
        b: [5, 10],
        c: [5, 10, 25, 35],
        d: [5, 10, 25, 35, 45, 55],
        e: [5, 10, 25, 35, 45, 55, 65, 75],
        f: [5, 10, 25, 35, 45, 55, 65, 75, 85],
        g: [5, 10, 25, 35, 45, 55, 65, 75, 85, 90],
        h: [1, 5, 10, 25, 35, 45, 55, 65, 75, 85, 90, 100]
    },
    traitDice: ['d4!', 'd6!', 'd8!', 'd10!', 'd12!', 'd20!', 'd20!+d4!', 'd20!+d6!', 'd20!+d8!', 'd20!+d10!', 'd20!+d12!', '2d20!'],
    relicTable: {
        a: {minor: 10, middling: 0},
        b: {minor: 25, middling: 0},
        c: {minor: 45, middling: 5},
        d: {minor: 60, middling: 10},
        e: {minor: 70, middling: 25},
        f: {minor: 80, middling: 45},
        g: {minor: 100, middling: 60}
    },
    enchantedTable: {
        a: {minor: 10, middling: 0},
        b: {minor: 25, middling: 0},
        c: {minor: 45, middling: 5},
        d: {minor: 60, middling: 10},
        e: {minor: 70, middling: 25},
        f: {minor: 80, middling: 45},
        g: {minor: 100, middling: 60}
    },
    scrollPower: {
        a: "6+d4",
        b: "7+2d4",
        c: "9+3d4",
        d: "12+2d6",
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