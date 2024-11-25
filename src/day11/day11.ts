import exp from "node:constants";
import {Sequence} from "generator-sequences";

const GENERATOR = "generator";
const MICROCHIP = "microchip";
export type TechType = typeof GENERATOR | typeof MICROCHIP;

export function parseFloor(line: string) {
    const floor = new Floor();
    const matches = line.matchAll(/ ([a-z]+)(?:-compatible)? (generator|microchip)/g);
    for (const m of matches) {
        const [, element, tech] = m;
        floor.items.add(new Item(element, tech as TechType));
    }
    return floor;
}

export class Item {
    constructor(readonly element: string,
                readonly tech: TechType) {}
}

export class Floor {
    readonly items = new Set<Item>();
}

export class Facility {
    private elevatorFloor = 0;
    private constructor(readonly floors: Array<Floor>) {}

    static async buildFromDescription(lines: Sequence<string>) {
        const floors = new Array<Floor>();
        for await (const line of lines) {
            floors.push(parseFloor(line));
        }

        return new Facility(floors);
    }

    // You have possible steps, some of which are dead ends.
    // When a path's taking you _away_ from the state you want, weight against it.
    //
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day11.input.txt`;
    console.log((filepath));
}