import {expect, describe, it} from "vitest";
import {findValueToSend, shortcutCalculation} from "./day23.js";
import {linesFromFile, Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Solves example", async () => {
        const lines = new Sequence([
            "cpy 2 a",
            "tgl a",
            "tgl a",
            "tgl a",
            "cpy 1 a",
            "dec a",
            "dec a",
        ]);
        const initial_a = 7;
        expect(await findValueToSend(lines, initial_a)).toBe(3);
    });
});

describe("Part 2", () => {
    it("Calculates quickly", async () => {
        // Uses the real puzzle input from a file.
        const filepath = `${import.meta.dirname}/day23.input.txt`;
        const lines = linesFromFile(filepath);
        const initial_a = 7;
        expect(await findValueToSend(lines, initial_a)).toBe(shortcutCalculation(initial_a));
    });
});