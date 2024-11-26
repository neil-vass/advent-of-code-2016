import {linesFromFile, Sequence} from "generator-sequences";
import {MinPriorityQueue} from "../utils/graphSearch.js";

const GENERATOR = "generator";
const MICROCHIP = "microchip";
export type TechType = typeof GENERATOR | typeof MICROCHIP;

export type SerializedFacility = string;
export type StateCategorization = string;
export const GOAL_CONDITION: StateCategorization = "goal";

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
        const generators = this.generators();
        if (generators.length === 0) return true;

        for (const m of this.microchips()) {
            if (generators.every(g => g.element !== m.element)) return false;
        }
        return true;
    }

    microchips() {
        return this.items.filter(i => i.tech === MICROCHIP);
    }

    generators() {
        return this.items.filter(i => i.tech === GENERATOR);
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

    serialize(): SerializedFacility {
        return JSON.stringify(this);
    }

    categorizeState(): StateCategorization {
        // If all the items are on the top floor, we've met the goal.
        const itemsNotAtTop = this.floors.slice(0, -1).flatMap(f => f.items);
        if (itemsNotAtTop.length === 0) return GOAL_CONDITION;

        // Otherwise, counts of chips and generators on each floor, plus
        // elevator position, is enough to categorize equivalent states.
        const state = { elevator: this.elevatorFloor, floors: [] as any[] };
        for (const floor of this.floors) {
            state.floors.push({
                microchips: floor.microchips().length,
                generators: floor.generators().length});
        }
        return JSON.stringify(state);
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
export const Explorer = {

    // Adaptation of the A_starSearch function from graphSearch.ts.
    // Same algorithm, but stores Facility objects (to carry on exploring) along with
    // a summary of their "state" to check for "have we seen this before" equivalents.
    shortestPathToGoal(start: Facility) {
        const frontier = new MinPriorityQueue<Facility>();
        const visited = new Map<StateCategorization, { costSoFar: number, cameFrom: Facility | null }>();

        frontier.push(start, 0);
        visited.set(start.categorizeState(), { costSoFar: 0, cameFrom: null });

        while (!frontier.isEmpty()) {
            const current = frontier.pull()!;
            if (current.categorizeState() === GOAL_CONDITION) break;

            for (const n of this.neighbours(current)) {
                const newCost = visited.get(current.categorizeState())!.costSoFar + n.cost;
                const oldCost = visited.get(n.node.categorizeState())?.costSoFar;

                // If we haven't been here before, _or_ if we've found a cheaper way to get here
                if (oldCost === undefined || newCost < oldCost) {
                    const priority = newCost + this.heuristic(n.node);
                    frontier.push(n.node, priority);
                    visited.set(n.node.categorizeState(), { costSoFar: newCost, cameFrom: current});
                }
            }
        }

        // Todo: we can just return cost to goal, right? Or throw?
        return visited;
    },

    // "to" is ignored here; rather than a specific destination, we want some
    // conditions met and don't care about others.
    heuristic(from: Facility): number {
        // Win condition: all microchips on top floor, don't care where
        // anything else is (generators, elevator). Min moves from here to
        // there: you can move two items at a time, so let's say 0.5 "cost"
        // for each floor away from the top each microchip is.
        let score = 0;

        const currentState = from;
        const topFloorNum = currentState.floors.length - 1;
        if (topFloorNum < 1) return score;

        for (let currFloor = 0; currFloor < topFloorNum; currFloor++) {
            const items =  currentState.floors[currFloor].items.length;
            score += 0.5 * items * (topFloorNum - currFloor);
        }

        return score;
    },

    // Where can we get to from here, in one step?
    *neighbours(currentNode: Facility): Iterable<{ node: Facility; cost: number }> {
        const serial = currentNode.serialize();
        let currentState = Facility.deserialize(serial);

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
                        node: currentState,
                        cost: 1
                    };
                }
                // Reset changes and keep looking for neighbours.
                currentState = Facility.deserialize(serial);
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

export async function solvePart1(facility: Facility) {
    const searchResult = Explorer.shortestPathToGoal(facility);
    const bestPathToGoal = searchResult.get(GOAL_CONDITION);

    if (bestPathToGoal === undefined) {
        throw new Error(`No solution found`);
    } else {
        return bestPathToGoal.costSoFar;
    }
}

export async function solvePart2(facility: Facility) {
    facility.floors[0].items.push(new Item("elerium", "generator"));
    facility.floors[0].items.push(new Item("elerium", "microchip"));
    facility.floors[0].items.push(new Item("dilithium", "generator"));
    facility.floors[0].items.push(new Item("dilithium", "microchip"));
    return solvePart1(facility);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day11.input.txt`;
    const input = linesFromFile(filepath);
    const facility = await Facility.buildFromDescription(input);
    console.log(await solvePart2(facility));
}