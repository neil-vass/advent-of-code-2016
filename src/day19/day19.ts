import {singleLineFromFile} from "generator-sequences";

export function solvePart1(numElves: number) {
    // From inspecting patterns: the answer is elf #1 for any power of 2,
    // and goes up by 2 for each elf we add after that.
    const nearestPowerOfTwo = Math.pow(2, Math.floor(Math.log2(numElves)));
    return (numElves - nearestPowerOfTwo) * 2 + 1;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day19.input.txt`;
    const numElves = +singleLineFromFile(filepath);
    console.log(solvePart1(numElves));
}