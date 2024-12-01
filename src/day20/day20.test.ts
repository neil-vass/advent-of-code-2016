import {expect, describe, it} from "vitest";
import {blockRange, parseRange, solvePart1, solvePart2} from "./day20.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Parses range", () => {
        expect(parseRange("5-8")).toStrictEqual([5, 8]);
    });

    it("Blocks single range", () => {
        expect(blockRange([[0,9]], [5,8])).toStrictEqual([
            [0,4], [9,9]
        ]);
    });

    it("Solves example", async () => {
        const maxIP = 9;
        const blocked = new Sequence([
            "5-8",
            "0-2",
            "4-7",
        ]);
        expect(await solvePart1(maxIP, blocked)).toBe(3);
    });
});

describe("Part 2", () => {
    it("Solves example", async () => {
        const maxIP = 9;
        const blocked = new Sequence([
            "5-8",
            "0-2",
            "4-7",
        ]);
        expect(await solvePart2(maxIP, blocked)).toBe(2);
    });
});