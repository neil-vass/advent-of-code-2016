import {expect, describe, it} from "vitest";
import {solvePart1} from "./day23.js";
import {Sequence} from "generator-sequences";

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
        expect(await solvePart1(lines)).toBe(3);
    });
});