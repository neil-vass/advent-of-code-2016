import {singleLineFromFile} from "generator-sequences";

export function generateData(initial: string, desiredLength: number) {
    let a = initial.split("");
    while (a.length < desiredLength) {
        let b = a.toReversed().map(c => c === "0" ? "1" : "0");
        a = a.concat(["0"], b);
    }
    return a.slice(0, desiredLength).join("");
}

export function generateChecksum(data: string) {
    let checksum = data.split("");
    while (checksum.length % 2 === 0) {
        const newChecksum = new Array<string>();
        for (let i = 0; i < checksum.length - 1; i += 2) {
            if (checksum[i] === checksum[i + 1]) {
                newChecksum.push("1");
            } else {
                newChecksum.push("0");
            }
        }
        checksum = newChecksum;
    }
    return checksum.join("");
}

function solvePart1(filepath: string) {
    const initial = singleLineFromFile(filepath);
    const data = generateData(initial, 272);
    return generateChecksum(data);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day16.input.txt`;
    console.log(solvePart1(filepath));
}