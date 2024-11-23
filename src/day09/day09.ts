import {singleLineFromFile} from "generator-sequences";

export function decompressedLengthOf(s: string) {
    let lengthSoFar = 0;
    let curr = 0;
    const startsWithMarker = /^\((\d+)x(\d+)\)/;

    while (curr < s.length) {
        const m = s.slice(curr).match(startsWithMarker);
        if (m) {
            const [marker, charCount, repeats] = [m[0], +m[1], +m[2]];
            lengthSoFar += (charCount * repeats);
            curr += (marker.length + charCount);
        } else {
            lengthSoFar += 1;
            curr += 1;
        }
    }

    return lengthSoFar;
}

export function decompressedLengthV2(s: string) {
    let lengthSoFar = 0;
    let curr = 0;
    const startsWithMarker = /^\((\d+)x(\d+)\)/;

    while (curr < s.length) {
        const m = s.slice(curr).match(startsWithMarker);
        if (m) {
            const [marker, charCount, repeats] = [m[0], +m[1], +m[2]];
            curr += marker.length;
            const dataSection = s.slice(curr, curr + charCount);

            lengthSoFar += (decompressedLengthV2(dataSection) * repeats);
            curr += charCount;
        } else {
            lengthSoFar += 1;
            curr += 1;
        }
    }

    return lengthSoFar;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day09.input.txt`;
    console.log(decompressedLengthV2(singleLineFromFile(filepath)));
}


