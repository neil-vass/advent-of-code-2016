import {singleLineFromFile} from "generator-sequences";


export function solvePart1(numElves: number) {
    // From inspecting patterns: the answer is elf #1 for any power of 2,
    // and goes up by 2 for each elf we add after that.
    const lastPowerOfTwoPassed = Math.pow(2, Math.floor(Math.log2(numElves)));
    return (numElves - lastPowerOfTwoPassed) * 2 + 1;
}

function slowSolvePart2(numElves: number) {
    // Simulate every step. Gets correct answers, but is far
    // to slow to use for the real puzzle input. I used this
    // to look for patterns and find a formula.
    let elves = Array.from({length: numElves}, (_,i) => i+1);

    while (elves.length > 1) {
        // Sit out for a moment.
        const thisElf = elves.shift()!;

        const targetIdx = Math.floor((elves.length -1) / 2);
        elves.splice(targetIdx, 1);

        // Back in the group.
        elves.push(thisElf);
    }

    // Only one left.
    return elves[0];
}


export function solvePart2(numElves: number) {
    const logBase = (base: number, n: number) => Math.log(n) / Math.log(base);
    const lastPowerOf3Passed = Math.pow(3, Math.floor(logBase(3, numElves)));
    const remainder = numElves - lastPowerOf3Passed;
    const doubledSection = remainder - lastPowerOf3Passed;
    return remainder + (doubledSection > 0 ? 2 * doubledSection : 0);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day19.input.txt`;
    const numElves = +singleLineFromFile(filepath);
    console.log(solvePart2(numElves));
}