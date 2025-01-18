import {expect, describe, it} from "vitest";
import {solve} from "./day24.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Solves example", async () => {
        const lines = new Sequence([
            "###########",
            "#0.1.....2#",
            "#.#######.#",
            "#4.......3#",
            "###########",
        ]);
        expect(await solve(lines)).toBe(14);
    });
});