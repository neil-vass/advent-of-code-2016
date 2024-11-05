import {linesFromFile} from "../helpers/filereader.js";
import {Sequence} from "../helpers/sequence.js";


export function isValidTriangle(a: number, b: number, c: number) {
    return (a + b > c) && (a + c > b) && (b + c > a);
}

export function parseTriangle(s: string): [number, number, number] {
    const m = s.match(/^\s*(\d+)\s+(\d+)\s+(\d+)$/);
    if (!m) throw new Error(`Unexpected line format ${s}`);
    const [, a, b, c] = m;
    return [+a, +b, +c];
}

export function collectVerticalTriangles(input: Sequence<string>) {

    async function* apply(input: Sequence<string>) {
        let step = "a";
        let aSides = [0,0,0];
        let bSides = [0,0,0];
        let cSides = [0,0,0];

        for await(const ln of input) {
            if (step === "a") {
                aSides = parseTriangle(ln);
                step = "b";
            } else if (step === "b") {
                bSides = parseTriangle(ln);
                step = "c";
            } else if (step === "c") {
                cSides = parseTriangle(ln);
                yield [aSides[0], bSides[0], cSides[0]] as [number, number, number];
                yield [aSides[1], bSides[1], cSides[1]] as [number, number, number];
                yield [aSides[2], bSides[2], cSides[2]] as [number, number, number];
                step = "a";
            }
        }
    }

    return new Sequence(apply(input));
}

export async function solvePart1(input: Sequence<string>) {
    const validTriangles = input.map(parseTriangle).filter(t => isValidTriangle(...t));
    return await Sequence.count(validTriangles);
}

export async function solvePart2(input: Sequence<string>) {
    const validTriangles = collectVerticalTriangles(input).filter(t => isValidTriangle(...t));
    return await Sequence.count(validTriangles);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day03.input.txt`;
    const input = linesFromFile(filepath);
    console.log(await solvePart2(input));
}

