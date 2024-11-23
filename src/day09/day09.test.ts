import {describe, expect, it} from "vitest";
import {decompressedLengthOf} from "./day09.js";

describe("Part 1", () => {
    it("Gives string length when no markers", () => {
        expect(decompressedLengthOf("ADVENT")).toBe(6);
    });

    it("Repeats single character", () => {
        expect(decompressedLengthOf("A(1x5)BC")).toBe(7);
    });

    it("Repeats multiple characters", () => {
        expect(decompressedLengthOf("(3x3)XYZ")).toBe(9);
    });

    it("Applies multiple markers", () => {
        expect(decompressedLengthOf("A(2x2)BCD(2x2)EFG")).toBe(11);
    });

    it("Ignores markers if they're inside another marker's data section", () => {
        expect(decompressedLengthOf("(6x1)(1x3)A")).toBe(6);
    });

    it("Doesn't further process decompressed data", () => {
        expect(decompressedLengthOf("X(8x2)(3x3)ABCY")).toBe(18);
    });
});