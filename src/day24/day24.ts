import {linesFromFile, Sequence} from "generator-sequences";
import {A_starSearch, WeightedGraph} from "../utils/graphSearch.js";

type Pos = {row: number, col: number};
type AirconNode = {pos: Pos, collectedLocations: string[]}

export class Aircon implements WeightedGraph<AirconNode>{
    private constructor(private readonly grid: string[],
                        private readonly start: Pos,
                        private readonly requiredLocations: Set<string>,
                        private readonly returnToStart: boolean) {}

    static async buildFromDescription(lines: Sequence<string>, returnToStart: boolean) {
        const grid: string[] = [];
        let start = {row: 0, col: 0};
        const requiredLocations = new Set<string>();
        let row = 0;
        for await (const line of lines) {
            for (let col=0; col<line.length; col++) {
                if(line[col].match(/\d/)) {
                    requiredLocations.add(line[col]);
                    if (line[col] === "0") start = {row, col};
                }
            }
            grid.push(line);
            row++;
        }
        return new Aircon(grid, start, requiredLocations, returnToStart);
    }

    *neighboursWithCosts(currentNode: AirconNode) {
        const {pos, collectedLocations} = currentNode;
        const neighbours = [
            {row: pos.row+1, col: pos.col},
            {row: pos.row-1, col: pos.col},
            {row: pos.row, col: pos.col+1},
            {row: pos.row, col: pos.col-1},
        ];
        for (const n of neighbours) {
            if (this.grid[n.row][n.col] === ".") {
                yield { node: {pos: n, collectedLocations}, cost: 1};
            } else if (this.grid[n.row][n.col].match(/\d/)) {
                const loc = new Set(collectedLocations);
                loc.add(this.grid[n.row][n.col]);
                yield { node: {pos: n, collectedLocations: [...loc].sort()}, cost: 1};
            }
        }
    }

    heuristic(from: AirconNode, to: AirconNode) {
        return 0;
    }

    isAtGoal(candidate: AirconNode, goal: AirconNode): boolean {
        if (this.returnToStart) {
            if (this.grid[candidate.pos.row][candidate.pos.col] !== "0") {
                return false;
            }
        }
        const collected = new Set(candidate.collectedLocations);
        return this.requiredLocations.difference(collected).size === 0;
    }

    findBestPathCost() {
        const init = { pos: this.start, collectedLocations: ["0"] };
        const dummy = {} as AirconNode; // We never use the goal, let's remove it.
        const result = A_starSearch(this, init, dummy);
        return result.cost;
    }
}

export async function solve(lines: Sequence<string>, returnToStart: boolean) {
    const aircon = await Aircon.buildFromDescription(lines, returnToStart);
    return aircon.findBestPathCost();
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day24.input.txt`;
    const returnToStart = true;
    console.log(await solve(linesFromFile(filepath), returnToStart));
}