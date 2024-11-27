import {linesFromFile} from "generator-sequences";

export type Disc = { distance: number, positions: number, startPos: number };

const gcd = (a: number, b: number): number  => a ? gcd(b % a, a) : b;
const lcm = (a: number, b: number) => a * b / gcd(a, b);

export function parseDisc(line: string): Disc {
    const m = line.match(/^Disc #(\d+) has (\d+) positions; at time=0, it is at position (\d+).$/);
    if (!m) throw new Error(`Unrecognized input: ${line}`);
    return {distance: +m[1], positions: +m[2], startPos: +m[3]};
}

export function firstTimeToDropToHitSlot(disc: Disc) {
    return (disc.positions - (disc.startPos + disc.distance)) % disc.positions;
}

function hitPosition(disc: Disc, dropTime: number) {
    return (disc.startPos + disc.distance + dropTime) % disc.positions;
}

export function timeToPressButton(input: string[]) {
    const discs = input.map(parseDisc);
    let dropTime = firstTimeToDropToHitSlot(discs[0]);
    let period = discs[0].positions;

    for (let i = 1; i < discs.length; i++) {
        while (true) {
            if (hitPosition(discs[i], dropTime) === 0) {
                period = lcm(period, discs[i].positions);
                break;
            }
            dropTime += period;
        }
    }
    return dropTime
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day15.input.txt`;
    const input = await linesFromFile(filepath).toArray();
    input.push("Disc #7 has 11 positions; at time=0, it is at position 0.");
    console.log(timeToPressButton(input));
}

