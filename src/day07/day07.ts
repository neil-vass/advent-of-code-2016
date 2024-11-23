import {linesFromFile, Sequence} from "generator-sequences";

export function hasABBA(s: string) {
    const m = s.match(/(.)(?!\1)(.)\2\1/);
    return m !== null;
}

export function splitAddress(address: string) {
    const m = address.match(/([^\[\]]+)/g);
    if (!m) throw new Error("Empty address");

    return {
        standard: m.filter((val, idx) => idx % 2 === 0),
        hypernet: m.filter((val, idx) => idx % 2 !== 0)
    }
}

export function supportsTLS(address: string) {
    const {standard, hypernet} = splitAddress(address);
    return (standard.some(hasABBA) && !hypernet.some(hasABBA));
}

async function solvePart1(input: Sequence<string>) {
    return Sequence.count(input.filter(supportsTLS));
}

// ---- Part 2 ---- //

export function supportsSSL(address: string) {
    const {standard, hypernet} = splitAddress(address);

    // For each of the ABA sequences in the "standard" parts, if there's
    // a corresponding BAB in any "hypernet" part, we support SSL.
    for (const s of standard) {
        const abaList = Array.from(s.matchAll(/(?=((.)(?!\2)(.)\2))/g), m => m[1]);
        for (const aba of abaList) {
            const bab = aba[1] + aba[0] + aba[1];
            if (hypernet.some(h => h.includes(bab))) {
                return true;
            }
        }
    }

    // No match found, SSL's not supported.
    return false;
}

async function solvePart2(input: Sequence<string>) {
    return Sequence.count(input.filter(supportsSSL));
}


// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day07.input.txt`;
    const input = linesFromFile(filepath);
    console.log(await solvePart2(input));
}