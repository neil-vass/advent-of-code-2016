import readline from "node:readline/promises";
import fs from "fs";
import {Sequence} from "./sequence.js";

export function singleLineFromFile(path: string) {
    return fs.readFileSync(path, "utf8").trimEnd();
}

export function linesFromFile(path: string) : Sequence<string> {
    async function* readFile() {
        for await (const line of readline.createInterface({input: fs.createReadStream(path)})) {
            yield line;
        }
    }
    return new Sequence(readFile());
}