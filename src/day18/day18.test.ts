import {describe, expect, it} from "vitest";
import {flagTraps, isTrap, rowAfter, solvePart1} from "./day18.js";

describe("Part 1", () => {
    it("Finds traps", () => {
        expect(isTrap(true, true, false)).toBe(true);
        expect(isTrap(false, true, true)).toBe(true);
        expect(isTrap(true, false, false)).toBe(true);
        expect(isTrap(false, false, true)).toBe(true);

        expect(isTrap(false, false, false)).toBe(false);
        expect(isTrap(true, true, true)).toBe(false);
        expect(isTrap(true, false, true)).toBe(false);
    });

    it("Predicts next row", () => {
        const first = flagTraps("..^^.");
        expect(first).toStrictEqual(
            [false, false, true, true, false]);
        expect(rowAfter(first)).toStrictEqual(
            [false, true, true, true, true]);
    });

    it("Counts safe tiles", () => {
        expect(solvePart1(".^^.^.^^^^", 10)).toBe(38);
    });
});