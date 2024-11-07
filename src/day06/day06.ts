import {Sequence} from "../helpers/sequence.js";
import {linesFromFile} from "../helpers/filereader.js";

type Counter = {[key: string]: number};

export async function countsAtEachPosition(messages: Sequence<string>) {
    const collectors: Counter[] = [];
    for await (const s of messages) {
        if(collectors.length === 0) {
            const counters = Array.from(s, () => new Object()) as Counter[];
            collectors.push(...counters);
        }

        for (let i = 0; i < s.length; i++) {
            const char = s[i];
            const prevVal = collectors[i][char];
            collectors[i][char] = prevVal ? prevVal + 1 : 1;
        }
    }

    return collectors;
}

export function mostFrequentLetterIn(lettersAndCounts: Counter) {
    const arr = Object.entries(lettersAndCounts);
    arr.sort((a, b) => b[1] - a[1]);
    return arr[0][0];
}

export async function corrected(messages: Sequence<string>) {
    const collection = await countsAtEachPosition(messages);
    return collection.reduce((acc, val) => acc + mostFrequentLetterIn(val), "");
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day06.input.txt`;
    const messages = linesFromFile(filepath);
    console.log(await corrected(messages));
}
