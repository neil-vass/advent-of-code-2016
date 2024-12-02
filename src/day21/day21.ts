import {linesFromFile, Sequence} from "generator-sequences";

//"`swap position X with position Y` means that the letters at indexes
// X and Y (counting from 0) should be swapped."
export function swapPositions(password: string[], xPos: number, yPos: number) {
    const updated = [...password];
    updated[xPos] = password[yPos];
    updated[yPos] = password[xPos];
    return updated;
}

// "`swap letter X with letter Y` means that the letters X and Y
// should be swapped (regardless of where they appear in the string)."
export function swapLetters(password: string[], xLetter: string, yLetter: string) {
    const updated = [...password];
    updated[password.indexOf(xLetter)] = yLetter;
    updated[password.indexOf(yLetter)] = xLetter;
    return updated;
}

// "`reverse positions X through Y` means that the span of letters at
// indexes X through Y (including the letters at X and Y) should be
// reversed in order."
export function reversePositions(password: string[], xPos: number, yPos: number) {
    const rev = password.slice(xPos, yPos+1).reverse();
    return password.slice(0, xPos).concat(rev, password.slice(yPos+1));
}

// "`rotate left/right X steps` means that the whole string should be
// rotated; for example, one right rotation would turn abcd into dabc."
export function rotateLeft(password: string[], xSteps: number) {
    return password.slice(xSteps).concat(password.slice(0, xSteps));
}

// As rotateLeft.
export function rotateRight(password: string[], xSteps: number) {
    return rotateLeft(password, -xSteps);
}

// "`move position X to position Y means that the letter which is at
// index X should be removed from the string, then inserted such that
// it ends up at index Y."
export function movePosition(password: string[], x: number, y: number) {
    const updated = [...password];
    const letter = password[x];
    updated.splice(x, 1);
    updated.splice(y, 0, letter);
    return updated;
}

// "`rotate based on position of letter X` means that the whole string
// should be rotated to the right based on the index of letter X
// (counting from 0) as determined before this instruction does any
// rotations. Once the index is determined, rotate the string to the
// right one time, plus a number of times equal to that index, plus
// one additional time if the index was at least 4"
export function rotateBasedOnLetter(password: string[], xLetter: string) {
    const xPos = password.indexOf(xLetter);
    let rotations = 1 + xPos + (xPos >= 4 ? 1 : 0);

    let updated = [...password];
    for (let i = 0; i < rotations; i++) {
        updated = rotateRight(updated, 1);
    }
    return updated;
}

// There _isn't_ a way to undo this for arbitrary string sizes.
// There is a solution for the string size we know we're getting here...
export function reverseRotateBasedOnLetter(password: string[], xLetter: string) {
    if (password.length !== 8) throw new Error(`Only works for 8 char strings`);

    const xPos = password.indexOf(xLetter);
    const lookup = { 0:9, 1:1, 2:6, 3:2, 4:7, 5:3, 6:8, 7:4 };

    // @ts-ignore We know this is an 8 char string.
    const rotations = lookup[xPos];

    let updated = [...password];
    for (let i = 0; i < rotations; i++) {
        updated = rotateLeft(updated, 1);
    }
    return updated;
}

export function applyOperation(password: string[], line: string) {
    let m = line.match(/^swap position (\d+) with position (\d+)$/);
    if (m) return swapPositions(password, +m[1], +m[2]);

    m = line.match(/^swap letter (.) with letter (.)$/);
    if (m) return swapLetters(password, m[1], m[2]);

    m = line.match(/^reverse positions (\d+) through (\d+)$/);
    if (m) return reversePositions(password, +m[1], +m[2]);

    m = line.match(/^rotate left (\d+) steps?$/)
    if (m) return rotateLeft(password, +m[1]);

    m = line.match(/^rotate right (\d+) steps?$/)
    if (m) return rotateRight(password, +m[1]);

    m = line.match(/^move position (\d+) to position (\d+)$/)
    if (m) return movePosition(password, +m[1], +m[2]);

    m = line.match(/^rotate based on position of letter (.)$/)
    if (m) return rotateBasedOnLetter(password, m[1]);

    throw new Error(`Unrecognized format: ${line}`);
}

export function reverseOperation(password: string[], line: string) {
    let m = line.match(/^swap position (\d+) with position (\d+)$/);
    if (m) return swapPositions(password, +m[1], +m[2]);

    m = line.match(/^swap letter (.) with letter (.)$/);
    if (m) return swapLetters(password, m[1], m[2]);

    m = line.match(/^reverse positions (\d+) through (\d+)$/);
    if (m) return reversePositions(password, +m[1], +m[2]);

    m = line.match(/^rotate left (\d+) steps?$/)
    if (m) return rotateRight(password, +m[1]);

    m = line.match(/^rotate right (\d+) steps?$/)
    if (m) return rotateLeft(password, +m[1]);

    m = line.match(/^move position (\d+) to position (\d+)$/)
    if (m) return movePosition(password, +m[2], +m[1]);

    m = line.match(/^rotate based on position of letter (.)$/)
    if (m) return reverseRotateBasedOnLetter(password, m[1]);

    throw new Error(`Unrecognized format: ${line}`);
}


export async function solvePart1(password: string, instructions: Sequence<string>) {
    let scrambled = [...password];
    for await (const line of instructions) {
        scrambled = applyOperation(scrambled, line);
    }
    return scrambled.join("");
}

export async function solvePart2(password: string, instructions: Sequence<string>) {
    let scrambled = [...password];
    const instructionsInReverseOrder = (await instructions.toArray()).reverse();

    for await (const line of instructionsInReverseOrder) {
        scrambled = reverseOperation(scrambled, line);
    }

    return scrambled.join("");
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day21.input.txt`;
    const instructions = linesFromFile(filepath);
    console.log(await solvePart2("fbgdceah", instructions));
}