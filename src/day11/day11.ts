import exp from "node:constants";
import {Sequence} from "generator-sequences";
import {WeightedGraph} from "../utils/graphSearch.js";

const GENERATOR = "generator";
const MICROCHIP = "microchip";
export type TechType = typeof GENERATOR | typeof MICROCHIP;

export type SerializedFacility = string;
export const GOAL_CONDITION: SerializedFacility = "goal";

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

    // Sets don't show their contents when serialized by JSON.stringify.
    // This method will get called, gives the items as an array instead.
    // We want the same Set to give the same JSON every time, so we
    // recognize whether we've seen it before, so it needs to be sorted.
    toJSON() {
        const description = [...this.items].map(i => `${i.element} ${i.tech}`);
        return { "items": description.sort() }
    }
}

export class Facility {
    elevatorFloor = 0;
    private constructor(readonly floors: Array<Floor>) {}

    static async buildFromDescription(lines: Sequence<string>) {
        const floors = new Array<Floor>();
        for await (const line of lines) {
            floors.push(parseFloor(line));
        }

        return new Facility(floors);
    }


    serializeToCheckForGoalCondition(): SerializedFacility {
        // If all the microchips are on the top floor, we've met the goal.
        const itemsNotAtTop = this.floors.slice(0, -1).flatMap(f => [...f.items]);
        if (itemsNotAtTop.some(item => item.tech === MICROCHIP)) {
            return JSON.stringify(this);
        } else {
            return GOAL_CONDITION;
        }
    }

    static deserialize(serial: SerializedFacility) {
        // '{"floors":[{"items":["hydrogen microchip"]},{"items":["hydrogen generator"]}],"elevatorFloor":0}'
        const data = JSON.parse(serial);

        const floors = new Array<Floor>();
        for (const floorData of data.floors) {
            const floor = new Floor();
            for (const itemData of floorData.items) {
                const [element, tech] = itemData.split(" ");
                floor.items.add(new Item(element, tech as TechType));
            }
            floors.push(floor);
        }

        const facility = new Facility(floors);
        facility.elevatorFloor = data.elevatorFloor;
        return facility;
    }


    // You have possible steps, some of which are dead ends.
    // When a path's taking you _away_ from the state you want, weight against it.
    //
}

// Let's go exploring.
export const Explorer: WeightedGraph<SerializedFacility> = {

    // "to" is ignored here; rather than a specific destination, we want some
    // conditions met and don't care about others.
    heuristic(from: SerializedFacility, to: SerializedFacility): number {

        // Win condition: all microchips on top floor, don't care where
        // anything else is (generators, elevator). Min moves from here to
        // there: you can move two items at a time, so let's say 0.5 "cost"
        // for each floor away from the top each microchip is.
        let score = 0;

        const currentState = Facility.deserialize(from);
        const topFloorNum = currentState.floors.length - 1;
        if (topFloorNum < 1) return score;

        for (let currFloor = 0; currFloor < topFloorNum; currFloor++) {
            const items =  [...currentState.floors[currFloor].items];
            const chips = items.filter(item => item.tech === MICROCHIP).length;
            score += 0.5 * chips * (topFloorNum - currFloor);
        }

        return score;
    },

    // Where can we get to from here, in one step?
    neighbours(currentNode: SerializedFacility): Iterable<{ node: SerializedFacility; cost: number }> {
        return undefined;
    }
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day11.input.txt`;
    console.log((filepath));
}