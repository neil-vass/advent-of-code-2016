import {describe, expect, it} from "vitest";
import {parseDisc, timeToPressButton} from "./day15.js";

describe("Part 1", () => {
    it("Parses input", () => {
        const line = "Disc #1 has 5 positions; at time=0, it is at position 4.";
        expect(parseDisc(line)).toStrictEqual(
            {distance: 1, positions: 5, startPos: 4});
    });

    it("Solves example", () => {
        const input = [
            "Disc #1 has 5 positions; at time=0, it is at position 4.",
            "Disc #2 has 2 positions; at time=0, it is at position 1."
        ];
        expect(timeToPressButton(input)).toBe(5);
    });
});
