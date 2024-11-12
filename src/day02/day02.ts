import {linesFromFile, Sequence} from "generator-sequences";

const U = "U";
const D = "D";
const L = "L";
const R = "R";

class Key {
    adjacentKeys = new Map<string, Key>();

    constructor(readonly label: string) {}
}

export class Keypad {
    #currentKey = new Key("dummy");

    constructor(layout="grid") {
        if (layout === "grid") {
            this.setupGridLayout();
        } else if (layout === "diamond") {
            this.setupDiamondLayout();
        } else {
            throw new Error("Unrecognized keypad layout");
        }

    }

    private setupGridLayout() {
        const _1 = new Key("1");
        const _2 = new Key("2");
        const _3 = new Key("3");
        const _4 = new Key("4");
        const _5 = new Key("5");
        const _6 = new Key("6");
        const _7 = new Key("7");
        const _8 = new Key("8");
        const _9 = new Key("9");

        _1.adjacentKeys = new Map([[R, _2], [D, _4]]);
        _2.adjacentKeys = new Map([[L, _1], [R, _3], [D, _5]]);
        _3.adjacentKeys = new Map([[L, _2], [D, _6]]);
        _4.adjacentKeys = new Map([[U, _1], [R, _5], [D, _7]]);
        _5.adjacentKeys = new Map([[U, _2], [R, _6], [D, _8], [L, _4]]);
        _6.adjacentKeys = new Map([[U, _3], [D, _9], [L, _5]]);
        _7.adjacentKeys = new Map([[U, _4], [R, _8]]);
        _8.adjacentKeys = new Map([[L, _7], [U, _5], [R, _9]]);
        _9.adjacentKeys = new Map([[L, _8], [U, _6]]);

        this.#currentKey = _5;
    }

    private setupDiamondLayout() {
        const _1 = new Key("1");
        const _2 = new Key("2");
        const _3 = new Key("3");
        const _4 = new Key("4");
        const _5 = new Key("5");
        const _6 = new Key("6");
        const _7 = new Key("7");
        const _8 = new Key("8");
        const _9 = new Key("9");
        const _A = new Key("A");
        const _B = new Key("B");
        const _C = new Key("C");
        const _D = new Key("D");

        _1.adjacentKeys = new Map([[D, _3]]);
        _2.adjacentKeys = new Map([[R, _3], [D, _6]]);
        _3.adjacentKeys = new Map([[L, _2], [U, _1], [R, _4], [D, _7]]);
        _4.adjacentKeys = new Map([[L, _3], [D, _8]]);
        _5.adjacentKeys = new Map([[R, _6]]);
        _6.adjacentKeys = new Map([[L, _5], [U, _2], [R, _7], [D, _A]]);
        _7.adjacentKeys = new Map([[L, _6], [U, _3], [R, _8], [D, _B]]);
        _8.adjacentKeys = new Map([[L, _7], [U, _4], [R, _9], [D, _C]]);
        _9.adjacentKeys = new Map([[L, _8]]);
        _A.adjacentKeys = new Map([[U, _6], [R, _B]]);
        _B.adjacentKeys = new Map([[L, _A], [U, _7], [R, _C], [D, _D]]);
        _C.adjacentKeys = new Map([[L, _B], [U, _8]]);
        _D.adjacentKeys = new Map([[U, _B]]);

        this.#currentKey = _5;
    }

    moveAndPress(directions: string) {
        for (const dir of directions) {
            const nextKey = this.#currentKey.adjacentKeys.get(dir);
            if (nextKey) {
                this.#currentKey = nextKey;
            }
        }
        return this.#currentKey.label;
    }


}

export async function solve(instructions: Sequence<string>, layout: string) {
    const pad = new Keypad(layout);

    function accumulateCode(codeSoFar: string, instruction: string) {
        return codeSoFar + pad.moveAndPress(instruction);
    }

    return await instructions.reduce(accumulateCode, "");
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const instructions = linesFromFile(`${import.meta.dirname}/day02.input.txt`);
    console.log(await solve(instructions, "diamond"));
}