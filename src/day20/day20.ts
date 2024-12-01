import {linesFromFile, Sequence} from "generator-sequences";

const LO = 0;
const HI = 1;

export type Range = [number, number];

export function parseRange(line: string): Range {
    const m = line.match(/^(\d+)-(\d+)$/);
    if (!m) throw new Error(`Unrecognized format: ${line}`);
    return [+m[1], +m[2]];
}

export function blockRange(permitted: Range[], toBlock: Range) {
    const updated: Range[] = [];
    for (const range of permitted) {
        if (toBlock[HI] < range[LO] || toBlock[LO] > range[HI]) {
            // Miss altogether
            updated.push([...range]);
        } else if (toBlock[LO] <= range[LO] && toBlock[HI] >= range[HI]) {
            // Remove completely
        } else {
            // Some overlap
            if (toBlock[LO] > range[LO]) {
                updated.push([range[LO], toBlock[LO]-1]);
            }
            if (toBlock[HI] < range[HI]) {
                updated.push([toBlock[HI]+1, range[HI]]);
            }
        }
    }
    return updated;
}


async function permittedRanges(maxIP: number, blocked: Sequence<string>) {
    let permitted: Range[] = [[0, maxIP]];
    for await (const range of blocked.map(parseRange)) {
        permitted = blockRange(permitted, range);
    }
    return permitted;
}

export async function solvePart1(maxIP: number, blocked: Sequence<string>) {
    const permitted = await permittedRanges(maxIP, blocked);
    return permitted[0][0];
}

export async function solvePart2(maxIP: number, blocked: Sequence<string>) {
    const permitted = await permittedRanges(maxIP, blocked);
    return permitted.reduce((acc, val) => (acc + 1 + val[HI] - val[LO]), 0);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day20.input.txt`;
    const blocked = linesFromFile(filepath);

    console.log(await solvePart2(4294967295, blocked));
}