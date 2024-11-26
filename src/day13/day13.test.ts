import {describe, expect, it} from "vitest";
import {isOpen, shortestPath, solvePart2} from "./day13.js";

describe("Part 1", () => {
    it("Finds walls and spaces", () => {
        const favourite = 10;
        expect(isOpen(0, 0, favourite)).toBe(true);
        expect(isOpen(1, 0, favourite)).toBe(false);
        expect(isOpen(9, 1, favourite)).toBe(false);
    });

    it("Finds shortest path to goal", () => {
        const favourite = 10;
        expect(shortestPath(7, 4, favourite)).toBe(11);
    });
});

describe("Part 2", () => {
    it("Finds reachable locations", () => {
        const maxSteps = 2
        const favourite = 10;
        expect(solvePart2(maxSteps, favourite)).toBe(5);
    });
});
