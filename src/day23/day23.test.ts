import {expect, describe, it} from "vitest";
import {findValueToSend} from "./day23.js";
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
        const initial_a = 7;
        expect(await findValueToSend(lines, initial_a)).toBe(3);
    });
});