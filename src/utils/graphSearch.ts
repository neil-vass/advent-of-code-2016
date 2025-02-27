// A few standard algorithms, implemented here after reading lots of sites but most especially these:
// Amit Patel's interactive guide is _fantastic_ for understanding how things work, and the python
// code there makes handy pseudocode for implementing them in any language.
//
// Patel, Amit J., "Introduction to the A* Algorithm",
//     Red Blob Games, 2014,
//     https://www.redblobgames.com/pathfinding/a-star/introduction.html
//
// Adrian Mejia walks through how priority queue's useful, and how to implement it using an array.
// https://adrianmejia.com/priority-queue-data-structure-and-heaps-time-complexity-javascript-implementation/

// Stack, used by depth first search.
export class Stack<T> {
    private readonly items = new Array<T>();

    isEmpty() {
        return this.items.length === 0;
    }

    push(elem: T) {
        this.items.push(elem);
    }

    pull() {
        if (this.items.length === 0) return null;
        return this.items.pop()!;
    }
}


// FIFO queue, used by breadthFirstSearch.
export class FifoQueue<T> {
    private items = new Array<T>();
    private head = 0;

    isEmpty() {
        return this.head === this.items.length;
    }

    push(elem: T) {
        this.items.push(elem);
    }

    pull() {
        if (this.isEmpty()) return null;
        const elem = this.items[this.head];
        delete this.items[this.head];
        this.head++;
        if(this.head > 1_000_000) {
            this.items = this.items.slice(this.head);
            this.head = 0;
        }
        return elem;
    }
}

// Graph objects passed to breadFirstSearch need this method.
export interface Graph<TNode> {
    neighbours(currentNode: TNode): Iterable<TNode>;
}


// BFS for reference: This visits all nodes, but doesn't do anything else -
// can customise it to calculate things at or report more about what it finds.
export function breadthFirstSearch<TNode>(graph: Graph<TNode>, start: TNode) {
    // Objects will be saved for comparisons.
    type SavedNode = string;
    const save = (n: TNode): SavedNode => JSON.stringify(n);
    const load = (s: SavedNode): TNode => JSON.parse(s);

    const frontier = new FifoQueue<SavedNode>();
    const reached = new Set<SavedNode>();

    const savedStart = save(start);
    frontier.push(savedStart);
    reached.add(savedStart);

    while (!frontier.isEmpty()) {
        const current = frontier.pull()!;
        for (const n of graph.neighbours(load(current))) {
            const savedNeighbour = save(n);
            if (!reached.has(savedNeighbour)) {
                frontier.push(savedNeighbour);
                reached.add(savedNeighbour);
            }
        }
    }

    return new Set([...reached].map(load));
}


// For use with A* or Dijkstra's algorithm. Takes items and their
// priority, and gives them back in order from smallest priority
// first. Uses a binary heap for storage.
export class MinPriorityQueue<T> {
    private heap = new Array<{item: T, priority: number}>();

    isEmpty() {
        return this.heap.length === 0;
    }

    // Add element to the queue with given priority.
    push(item: T, priority: number) {
        this.heap.push({ item, priority });
        this.siftUp();
    }

    // Remove the item with the smallest priority from the
    // queue and return it.
    pull() {
        if (this.heap.length === 0) return null;
        this.swap(0, this.heap.length -1);
        const {item} = this.heap.pop()!;
        this.siftDown();
        return item;
    }

    // After adding a new element to the bottom of the
    // binary heap, keep sifting it up until it's no longer
    // smaller priority than its immediate parent.
    private siftUp() {
        let currentIndex = this.heap.length -1;

        while (currentIndex > 0) {
            const parentIndex = Math.ceil((currentIndex/2) -1);

            if (this.isHigherPriority(currentIndex, parentIndex)) return;

            this.swap(currentIndex, parentIndex);
            currentIndex = parentIndex;
        }
    }

    // After moving an element to the top of the binary heap,
    // keep sifting it down until it's no longer smaller priority
    // than its children.
    private siftDown() {
        let currentIndex = 0;

        while (true) {
            const childIndex = this.lowestPriorityChild(currentIndex);

            if (childIndex === null) return;
            if (this.isHigherPriority(childIndex, currentIndex)) return;

            this.swap(currentIndex, childIndex);
            currentIndex = childIndex;
        }
    }

    private isHigherPriority(idx1: number, idx2: number) {
        return this.heap[idx1].priority > this.heap[idx2].priority;
    }

    private swap(idx1: number, idx2: number) {
        [this.heap[idx1], this.heap[idx2]] = [this.heap[idx2], this.heap[idx1]];
    }

    private lowestPriorityChild(idx: number) {
        const leftChildIndex = (2*idx) +1;
        if (leftChildIndex >= this.heap.length) return null;

        const rightChildIndex = leftChildIndex +1;
        if (rightChildIndex >= this.heap.length) return leftChildIndex;

        return this.isHigherPriority(leftChildIndex, rightChildIndex) ? rightChildIndex : leftChildIndex;
    }
}


// Graph objects passed to A* search need these methods.
export interface WeightedGraph<TNode> {
    // Nodes you can get to in one step, along with cost to move there.
    neighboursWithCosts(currentNode: TNode): Iterable<{node: TNode, cost: number}>;

    // A* needs a heuristic: what is the estimated cost to get from one node
    // to another? If your heuristic:
    // - Underestimates costs, then search will find the correct answer
    //     (the more you underestimate, the less efficient search will be).
    // - Estimates perfectly, search will find the correct answer without needing to
    //     explore anything except the best path.
    // - Overestimates costs, then search might not find the correct answer
    //     (can find one path, and ignore others as they look more expensive).
    //
    // You can use A* search with no heuristic (just return 0) to do Dijkstra's algorithm.
    heuristic(from: TNode, to: TNode): number;

    isAtGoal(candidate: TNode, goal: TNode): boolean;
}

export function A_starSearch<TNode>(graph: WeightedGraph<TNode>, start: TNode, goal: TNode) {
    // Objects will be saved for comparisons.
    type SavedNode = string;
    const save = (n: TNode): SavedNode => JSON.stringify(n);
    const load = (s: SavedNode): TNode => JSON.parse(s);

    const frontier = new MinPriorityQueue<SavedNode>();
    const visited = new Map<SavedNode, { costSoFar: number, cameFrom: SavedNode | null }>();

    const savedStart = save(start);
    frontier.push(savedStart, 0);
    visited.set(savedStart, { costSoFar: 0, cameFrom: null});

    while (!frontier.isEmpty()) {
        const savedCurrent = frontier.pull()!;
        const current = load(savedCurrent);
        if (graph.isAtGoal(current, goal)) {
            // Goal reached!
            const savedSolution = visited.get(savedCurrent)!;
            return { cost: savedSolution.costSoFar,  state: current };
        }

        for (const n of graph.neighboursWithCosts(current)) {
            const savedNeighbour = save(n.node);
            const newCost = visited.get(savedCurrent)!.costSoFar + n.cost;
            const oldCost = visited.get(savedNeighbour)?.costSoFar;

            // If we haven't been here before, _or_ if we've found a cheaper way to get here
            if (oldCost === undefined || newCost < oldCost) {
                const priority = newCost + graph.heuristic(n.node, goal);
                frontier.push(savedNeighbour, priority);
                visited.set(savedNeighbour, { costSoFar: newCost, cameFrom: savedCurrent});
            }
        }
    }
    // The end of all our exploring.
    throw new Error("No path to the goal was found.")
}