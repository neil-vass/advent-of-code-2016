import exp from "node:constants";
import {linesFromFile, Sequence} from "generator-sequences";
import {A_starSearch, WeightedGraph} from "../utils/graphSearch.js";

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
        floor.items.push(new Item(element, tech as TechType));
    }
    return floor;
}

export class Item {
    constructor(readonly element: string,
                readonly tech: TechType) {}
}

export class Floor {
    readonly items = new Array<Item>();

    // This method will get called when serialized by JSON.stringify.
    // We want the same set to give the same JSON every time, so we
    // recognize whether we've seen it before, so it needs to be sorted.
    toJSON() {
        const description = this.items.map(i => `${i.element} ${i.tech}`);
        return { "items": description.sort() }
    }

    // True if we're not irradiating any microchips here.
    // It's fine if: there are no generators at all, or if each microchip
    // has its matching generator to protect it.
    isValid() {
        const generators = this.items.filter(i => i.tech === GENERATOR);
        if (generators.length === 0) return true;

        const microchips = this.items.filter(i => i.tech === MICROCHIP);
        for (const m of microchips) {
            if (generators.every(g => g.element !== m.element)) return false;
        }
        return true;
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
        // If all the items are on the top floor, we've met the goal.
        const itemsNotAtTop = this.floors.slice(0, -1).flatMap(f => f.items);
        if (itemsNotAtTop.length === 0) {
            return GOAL_CONDITION;
        } else {
            return JSON.stringify(this);
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
                floor.items.push(new Item(element, tech as TechType));
            }
            floors.push(floor);
        }

        const facility = new Facility(floors);
        facility.elevatorFloor = data.elevatorFloor;
        return facility;
    }

    numItemsOnCurrentFloor() {
        return this.floors[this.elevatorFloor].items.length;
    }

    move(itemsToMove: Array<number>, floorIdx: number) {
        // Sort indexes descending, or we'll lose track as we remove things.
        itemsToMove = [...itemsToMove].sort((a,b) => b-a);
        for (const itemIdx of itemsToMove) {
            const [item] = this.floors[this.elevatorFloor].items.splice(itemIdx, 1);
            this.floors[floorIdx].items.push(item);
        }
        this.elevatorFloor = floorIdx;
    }

    isValid() {
        return this.floors.every(f => f.isValid());
    }
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
        if (from === GOAL_CONDITION) return 0;
        let score = 0;

        const currentState = Facility.deserialize(from);
        const topFloorNum = currentState.floors.length - 1;
        if (topFloorNum < 1) return score;

        for (let currFloor = 0; currFloor < topFloorNum; currFloor++) {
            const items =  currentState.floors[currFloor].items;
            const chips = items.filter(item => item.tech === MICROCHIP).length;
            score += 0.5 * chips * (topFloorNum - currFloor);
        }

        return score;
    },

    // Where can we get to from here, in one step?
    *neighbours(currentNode: SerializedFacility): Iterable<{ node: SerializedFacility; cost: number }> {
        let currentState = Facility.deserialize(currentNode);

        const floorsWeCanMoveToIdx = new Array<number>();
        if (currentState.elevatorFloor > 0) {
            floorsWeCanMoveToIdx.push(currentState.elevatorFloor-1);
        }
        if (currentState.elevatorFloor < currentState.floors.length-1) {
            floorsWeCanMoveToIdx.push(currentState.elevatorFloor+1);
        }

        for (const itemsToMove of onesAndTwos(currentState.numItemsOnCurrentFloor())) {
            for (const floorIdx of floorsWeCanMoveToIdx) {
                currentState.move(itemsToMove, floorIdx);
                if (currentState.isValid()) {
                    yield {
                        node: currentState.serializeToCheckForGoalCondition(),
                        cost: 1
                    };
                }
                // Reset changes and keep looking for neighbours.
                currentState = Facility.deserialize(currentNode);
            }
        }
    }
}

export function *onesAndTwos(itemCount: number) {
    for(let i=0; i< itemCount; i++) {
        yield [i];
        for (let j=i+1; j< itemCount; j++) {
            yield [j, i];
        }
    }
}

export async function solvePart1(input: Sequence<string>) {
    const facility = await Facility.buildFromDescription(input);
    const initialCondition = facility.serializeToCheckForGoalCondition();
    const searchResult = A_starSearch(Explorer, initialCondition, GOAL_CONDITION);
    const bestPathToGoal = searchResult.get(GOAL_CONDITION);

    if (bestPathToGoal === undefined) {
        throw new Error(`No solution found`);
    } else {
        return bestPathToGoal.costSoFar;
    }
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day11.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}