import {A_starSearch, breadthFirstSearch, Graph, WeightedGraph} from "../utils/graphSearch.js";
import {md5} from "js-md5";
import {singleLineFromFile} from "generator-sequences";

const GAME_WIDTH = 4;
const GAME_HEIGHT = 4;
const DIRECTIONS = "UDLR"
const OPEN_CODES = "bcdef";

type GameState = { path: string, x: number, y: number }

const hashCache = new Map<string, string>();

export function hash(s: string) {
    let answer = hashCache.get(s);
    if(!answer) {
        answer = md5(s).slice(0, 4);
        hashCache.set(s, answer);
    }
    return answer;
}


export function isInBounds(node: GameState) {
    return 0 <= node.x && node.x < GAME_WIDTH &&
            0 <= node.y && node.y < GAME_HEIGHT;
}


export function doorIsOpen(passcode: string, path: string, dir: string) {
    const hashPath = hash(passcode + path);
    const charForThisDir = hashPath[DIRECTIONS.indexOf(dir)];
    return OPEN_CODES.includes(charForThisDir);
}

function moveFn(dir: string, xChange: number, yChange: number, passcode: string) {
    return function(currentNode: GameState) {
        const newNode = {
            path: currentNode.path + dir,
            x: currentNode.x + xChange,
            y: currentNode.y + yChange
        };

        if (isInBounds(newNode) && doorIsOpen(passcode, currentNode.path, dir)) {
            return newNode;
        }
    }
}



export class VaultExplorer implements Graph<GameState>, WeightedGraph<GameState> {
    readonly vaultLocation = { path: "", x: GAME_WIDTH-1, y: GAME_HEIGHT-1 };

    private readonly moveChecks: ((x: GameState) => GameState | undefined)[];

    constructor(private readonly passcode: string) {
        this.moveChecks = [
            moveFn("U", +0, -1, passcode),
            moveFn("D", +0, +1, passcode),
            moveFn("L", -1, +0, passcode),
            moveFn("R", +1, +0, passcode)
        ];
    }

    *neighbours(currentNode: GameState): Iterable<GameState> {
        if(this.isAtGoal(currentNode, this.vaultLocation)) return;

        for (const checkDirection of this.moveChecks) {
            const neighbour = checkDirection(currentNode);
            if (neighbour) {
                yield neighbour;
            }
        }
    }

    *neighboursWithCosts(currentNode: GameState): Iterable<{ node: GameState; cost: number; }> {
        for (const node of this.neighbours(currentNode)) {
            yield { node, cost: 1 };
        }
    }

    heuristic(from: GameState, to: GameState): number {
        // Best case: Manhattan distance.
        return Math.abs(to.x - from.x) + Math.abs(to.x - from.x);
    }

    isAtGoal(candidate: GameState, goal: GameState): boolean {
        // Don't care about the path, just the destination.
        return (candidate.x === goal.x && candidate.y === goal.y);
    }

}

export function solvePart1(passcode: string) {
    const initialState = { path: "", x: 0, y: 0 };
    const explorer = new VaultExplorer(passcode);
    const searchResult = A_starSearch(explorer, initialState, explorer.vaultLocation);
    return searchResult.state.path;
}

export function solvePart2(passcode: string) {
    const initialState = { path: "", x: 0, y: 0 };
    const explorer = new VaultExplorer(passcode);

    let longestPathSeen = 0;
    for (const result of breadthFirstSearch(explorer, initialState)) {
        if (explorer.isAtGoal(result, explorer.vaultLocation)) {
            longestPathSeen = Math.max(longestPathSeen, result.path.length);
        }
    }
    return longestPathSeen;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day17.input.txt`;
    const passcode = singleLineFromFile(filepath);
    console.log(solvePart2(passcode));
}
