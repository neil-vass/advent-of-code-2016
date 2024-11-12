import {afterEach, describe, expect, it, vi} from "vitest";
import {collectVerticalTriangles, isValidTriangle, parseTriangle, solvePart1} from "./day03.js";
import {Sequence} from "generator-sequences";


describe("Part 1", () => {
    it("Spots impossible triangle", () => {
        expect(isValidTriangle(5, 10, 25)).toBe(false);
    });

    it("Spots valid triangle", () => {
        expect(isValidTriangle(5, 22, 25)).toBe(true);
    });

    it("Separates into numbers", () => {
        expect(parseTriangle("   5  10  25")).toStrictEqual([5, 10, 25]);
    });

    it("Counts valid triangles", async () => {
        const input = new Sequence(["5 22 25"]);
        expect(await solvePart1(input)).toBe(1);
    });
});

describe("Part 2", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("Collects vertically", async () => {
        const input = new Sequence([
            "101 301 501",
            "102 302 502",
            "103 303 503",
            "201 401 601",
            "202 402 602",
            "203 403 603"
        ]);

        const rearranged = collectVerticalTriangles(input);
        expect(await rearranged.toArray()).toStrictEqual([
            [101, 102, 103],
            [301, 302, 303],
            [501, 502, 503],
            [201, 202, 203],
            [401, 402, 403],
            [601, 602, 603]
        ]);

    });
});
