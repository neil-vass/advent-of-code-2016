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

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day07.input.txt`;
    const input = linesFromFile(filepath);
    console.log(await solvePart1(input));
}

