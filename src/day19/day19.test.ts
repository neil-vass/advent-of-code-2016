import {expect, describe, it} from "vitest";
import {solvePart1, solvePart2} from "./day19.js";

describe("Part 1", () => {
    it("Matches example", () => {
        expect(solvePart1(5)).toBe(3);
    });
});

describe("Part 2", () => {
    it("Matches example", () => {
        expect(solvePart2(5)).toBe(2);
    });
});