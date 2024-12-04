import {linesFromFile, Sequence} from "generator-sequences";
import {av} from "vitest/dist/chunks/reporters.D7Jzd9GS.js";

export type StorageNode = {name: string, used: number, avail: number};

export function parseNode(line: string): StorageNode {
    const m = line.match(/^\/dev\/grid\/(node-x\d+-y\d+)\s+\d+T\s+(\d+)T\s+(\d+)T\s+\d+%$/);
    if (!m) throw new Error(`Unrecognized format: ${line}`);
    return {name: m[1], used: +m[2], avail: +m[3]};
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

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day22.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}

