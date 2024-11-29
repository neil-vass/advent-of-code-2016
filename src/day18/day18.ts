import {singleLineFromFile} from "generator-sequences";

export function isTrap(left: boolean, centre: boolean, right: boolean) {
    return (left && centre && !right) ||
        (!left && centre && right) ||
        (left && !centre && !right) ||
        (!left && !centre && right);
}

export function flagTraps(s: string) {
    return [...s].map(c => c === "^");
}

export function rowAfter(row: boolean[]) {
    const pad = [false, ...row, false];
    return row.map((_, i) => isTrap(pad[i], pad[i + 1], pad[i + 2]));
}

export function solvePart1(firstRowDescription: string, totalRows: number) {
    let currentRow = flagTraps(firstRowDescription);
    let safeCount = currentRow.filter(t => !t).length;

    for (let i = 1; i < totalRows; i++) {
        const nextRow = rowAfter(currentRow);
        currentRow = nextRow;
        safeCount += currentRow.filter(t => !t).length;
    }
    return safeCount;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day18.input.txt`;
    const firstRowDescription = singleLineFromFile(filepath);
    console.log(solvePart1(firstRowDescription, 400000));
}
