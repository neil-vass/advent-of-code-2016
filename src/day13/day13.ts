import {A_starSearch, FifoQueue, WeightedGraph} from "../utils/graphSearch.js";
import {singleLineFromFile} from "generator-sequences";

type Pos = { x: number, y: number };

export function isOpen(x: number, y: number, favourite: number) {
    const calc = (x*x + 3*x + 2*x*y + y + y*y) + favourite;
    const binary = calc.toString(2);
    const ones = binary.match(/1/g) || [];
    return ones.length % 2 === 0;
}

class Explorer implements WeightedGraph<Pos> {
    constructor(readonly favourite: number) {}

    *neighbours(currentNode: Pos): Iterable<{ node: Pos; cost: number; }> {
        const {x, y} = currentNode

        if (x > 0 && isOpen(x-1, y, this.favourite)) {
            yield { node: {x: x-1, y}, cost: 1 };
        }
        if (isOpen(x+1, y, this.favourite)) {
            yield { node: {x: x+1, y}, cost: 1 };
        }
        if (y > 0 && isOpen(x, y-1, this.favourite)) {
            yield { node: {x, y: y-1}, cost: 1 };
        }
        if (isOpen(x, y+1, this.favourite)) {
            yield { node: {x, y: y+1}, cost: 1 };
        }
    }

    heuristic(from: Pos, to: Pos): number {
        // Best case: Manhattan distance.
        return Math.abs(to.x - from.x) + Math.abs(to.x - from.x);
    }

    isAtGoal(candidate: Pos, goal: Pos): boolean {
        return candidate.x === goal.x && candidate.y === goal.y;
    }
}

export function shortestPath(goal_x: number, goal_y: number, favourite: number) {
    const explorer = new Explorer(favourite);
    const start = {x: 1, y: 1};
    const goal = {x: goal_x, y: goal_y};
    const route = A_starSearch(explorer, start, goal);
    return route.cost;
}

// Adapted from breadthFirstSearch in graphSearch.ts.
export function reachableLocations<TNode>(graph: WeightedGraph<TNode>, start: TNode, maxSteps: number) {
    type SavedNode = string;
    const save = (n: TNode): SavedNode => JSON.stringify(n);
    const load = (s: SavedNode): TNode => JSON.parse(s);

    const frontier = new FifoQueue<{ pos: SavedNode, steps: number }>();
    const reached = new Set<SavedNode>();

    const savedStart = save(start);
    frontier.push({pos: savedStart, steps: 0 });
    reached.add(savedStart);

    while (!frontier.isEmpty()) {
        const current = frontier.pull()!;
        if (current.steps >= maxSteps) continue;
        for (const n of graph.neighbours(load(current.pos))) {
            const savedNode = save(n.node);
            if (!reached.has(savedNode)) {
                frontier.push({ pos: savedNode, steps: current.steps+1 });
                reached.add(savedNode);
            }
        }
    }

    return reached;
}

export function solvePart2(maxSteps: number, favourite: number) {
    const explorer = new Explorer(favourite);
    const start = {x: 1, y: 1};
    return reachableLocations(explorer, start, maxSteps).size;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day13.input.txt`;
    const favourite = +singleLineFromFile(filepath);
    console.log("Part 1: " + shortestPath(31, 39, favourite));
    console.log("Part 2: " + solvePart2(50, favourite));
}