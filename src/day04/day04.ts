import {linesFromFile, Sequence} from "generator-sequences";

type Room = { encryptedName: string; sectorId: number; checksum: string };

export function parseRoom(s: string): Room {
    const m = s.match(/^([a-z\-]+)-(\d+)\[([a-z]+)\]$/);
    if (!m) throw new Error(`Unrecognized line: ${s}`);
    const [, encryptedName, sectorStr, checksum] = m;

    return { encryptedName, sectorId: +sectorStr, checksum };
}

export function countLetters(encryptedName: string) {
    const counter: {[key: string]: number} = {};
    for(const char of encryptedName) {
        if (char === "-") continue;
        const prevVal = counter[char];
        counter[char] = prevVal ? prevVal + 1 : 1;
    }
    return counter;
}

export function orderLetters(lettersAndCounts: {[key: string]: number}) {
    const arr = Object.entries(lettersAndCounts);

    arr.sort((a, b) => {
        const [aLetterCode, aCount] = [a[0].charCodeAt(0), a[1]];
        const [bLetterCode, bCount] = [b[0].charCodeAt(0), b[1]];

        if (aCount === bCount) return aLetterCode - bLetterCode;
        return bCount - aCount;
    });

    return arr;
}

export function checksumFor(encryptedName: string) {
    const counter = countLetters(encryptedName);
    const orderedLettersWithCounts = orderLetters(counter);
    const letters = orderedLettersWithCounts.slice(0,5).map(x => x[0]);
    return letters.join("");
}

export function isRealRoom(room: Room) {
    return room.checksum === checksumFor(room.encryptedName);
}

export function decryptRoomName(room: Room) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let shifted = "";
    for (const char of room.encryptedName) {
        if (char === "-") {
            shifted += " ";
        } else {
            const idx = (alphabet.indexOf(char) + room.sectorId) % alphabet.length;
            shifted += alphabet[idx];
        }
    }

    return shifted;
}

export async function solvePart1(input: Sequence<string>) {
    const realRooms = input.map(parseRoom).filter(isRealRoom);
    const sumOfSectorIds = Sequence.sum(realRooms.map(r => r.sectorId));
    return sumOfSectorIds;
}

// Print them out and have a read!
export async function solvePart2(input: Sequence<string>) {
    const realRooms = input.map(parseRoom).filter(isRealRoom)
    for await (const room of realRooms) {
        console.log(`${room.sectorId}: ${decryptRoomName(room)}`)
    }
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day04.input.txt`;
    const input = linesFromFile(filepath);
    await solvePart2(input);
}

