import {A_starSearch, FifoQueue, Graph, WeightedGraph} from "../utils/graphSearch.js";
import {singleLineFromFile} from "generator-sequences";

type Pos = { x: number, y: number };
type HashedPos = string;

const hash = (x: number, y: number) : HashedPos => JSON.stringify({x, y});
const unHash = (s: HashedPos) : Pos => JSON.parse(s);


export function isOpen(x: number, y: number, favourite: number) {
    const calc = (x*x + 3*x + 2*x*y + y + y*y) + favourite;
    const binary = calc.toString(2);
    const ones = binary.match(/1/g) || [];
    return ones.length % 2 === 0;
}

class Explorer implements WeightedGraph<HashedPos> {
    constructor(readonly favourite: number) {}

    *neighbours(currentNode: HashedPos): Iterable<{ node: HashedPos; cost: number; }> {
        const {x, y} = unHash(currentNode);

        if (x > 0 && isOpen(x-1, y, this.favourite)) {
            yield { node: hash(x-1, y), cost: 1 };
        }
        if (isOpen(x+1, y, this.favourite)) {
            yield { node: hash(x+1, y), cost: 1 };
        }
        if (y > 0 && isOpen(x, y-1, this.favourite)) {
            yield { node: hash(x, y-1), cost: 1 };
        }
        if (isOpen(x, y+1, this.favourite)) {
            yield { node: hash(x, y+1), cost: 1 };
        }
    }

    heuristic(from: HashedPos, to: HashedPos): number {
        // Best case: Manhattan distance.
        const [f, t] = [unHash(from), unHash(to)];
        return Math.abs(t.x - f.x) + Math.abs(t.x - f.x);
    }
}

export function shortestPath(goal_x: number, goal_y: number, favourite: number) {
    const explorer = new Explorer(favourite);
    const start = hash(1, 1);
    const goal = hash(goal_x, goal_y);
    const results = A_starSearch(explorer, start, goal);
    const pathToGoal = results.get(goal);

    if(!pathToGoal) throw new Error(`No path to goal!`);
    return pathToGoal.costSoFar;
}

// Adapted from breadthFirstSearch in graphSearch.ts.
export function reachableLocations<TNode>(graph: WeightedGraph<TNode>, start: TNode, maxSteps: number) {
    const frontier = new FifoQueue<{ pos: TNode, steps: number }>();
    const reached = new Set<TNode>();

    frontier.push({pos: start, steps: 0 });
    reached.add(start);

    while (!frontier.isEmpty()) {
        const current = frontier.pull()!;
        if (current.steps >= maxSteps) continue;
        for (const n of graph.neighbours(current.pos)) {
            if (!reached.has(n.node)) {
                frontier.push({ pos: n.node, steps: current.steps+1 });
                reached.add(n.node);
            }
        }
    }

    return reached;
}

export function solvePart2(maxSteps: number, favourite: number) {
    const explorer = new Explorer(favourite);
    const start = hash(1, 1);
    return reachableLocations(explorer, start, maxSteps).size;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day13.input.txt`;
    const favourite = +singleLineFromFile(filepath);
    console.log("Part 1: " + shortestPath(31, 39, favourite));
    console.log("Part 2: " + solvePart2(50, favourite));
}