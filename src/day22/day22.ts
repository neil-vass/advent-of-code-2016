import {linesFromFile, Sequence} from "generator-sequences";

export type StorageNode = {name: string, size: number, used: number, avail: number};

function posFromName(name: string) {
    const m = name.match(/^node-x(\d+)-y(\d+)$/);
    if (!m) throw new Error(`Unrecognized format: ${name}`);
    return {x: +m[1], y: +m[2]};
}

function nameFromPos(x: number, y: number) {
    return `node-x${x}-y${y}`;
}

export function parseNode(line: string): StorageNode {
    const m = line.match(/^\/dev\/grid\/(node-x\d+-y\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T\s+\d+%$/);
    if (!m) throw new Error(`Unrecognized format: ${line}`);
    return {name: m[1], size: +m[2], used: +m[3], avail: +m[4]};
}

export async function solvePart1(lines: Sequence<string>) {
    const nodes = lines.filter(ln => ln.startsWith("/dev/")).map(parseNode);
    const nodesByUsed = await nodes.toArray();
    nodesByUsed.sort((a,b) => b.used - a.used);
    const nodesByAvail = nodesByUsed.toSorted((a,b) => b.avail - a.avail);
    let pairCount = 0;
    let availIdx = -1;
    for (const nodeToMoveFrom of nodesByUsed) {
        if (nodeToMoveFrom.used === 0) break;
        while (availIdx < nodesByAvail.length-1 &&
                nodeToMoveFrom.used <= nodesByAvail[availIdx+1].avail) {
            availIdx++;
        }
        if (availIdx < 0) continue;
        const wouldFit = nodesByAvail.slice(0, availIdx+1).filter(n => n.name !== nodeToMoveFrom.name);
        pairCount += wouldFit.length;
    }
    return pairCount;
}


export async function solvePart2(lines: Sequence<string>) {
    const nodes = lines.filter(ln => ln.startsWith("/dev/")).map(parseNode);

    const nodeMap = new Map<string, StorageNode>();
    let xMax = 0;
    let yMax = 0;
    for await (const node of nodes) {
        nodeMap.set(node.name, node);
        const {x,y} = posFromName(node.name);
        xMax = Math.max(x, xMax);
        yMax = Math.max(y, yMax);
    }

    for (let y=0; y <= yMax; y++) {
        let row = "";
        for (let x=0; x <= xMax; x++) {
            const node = nodeMap.get(nameFromPos(x,y))!;
            row += node.used + "/" + node.size;
            if (x < xMax) row += "\t";
        }
        console.log(row);
    }
    return "Next: paste into a spreadsheet"
}
// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day22.input.txt`;
    console.log(await solvePart2(linesFromFile(filepath)));
}

