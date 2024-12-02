import {expect, describe, it} from "vitest";
import {
    reverseRotateBasedOnLetter,
    rotateBasedOnLetter,
    rotateLeft,
    rotateRight,
    solvePart1,
    solvePart2
} from "./day21.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Rotates right", () => {
        expect(rotateRight([..."abcd"], 1)).toStrictEqual([..."dabc"]);
    });

    it("Solves example", async () => {
        const instructions = new Sequence([
            "swap position 4 with position 0",
            "swap letter d with letter b",
            "reverse positions 0 through 4",
            "rotate left 1 step",
            "move position 1 to position 4",
            "move position 3 to position 0",
            "rotate based on position of letter b",
            "rotate based on position of letter d"
        ]);
        expect(await solvePart1("abcde", instructions)).toBe("decab");
    });
});

describe("Part 2", () => {
    it("Undoes a rotate based on letter", async () => {
        const initial = [..."fbgdceah"];
        const encoded = rotateBasedOnLetter(initial, "a");
        const decoded = reverseRotateBasedOnLetter(encoded, "a");
        expect(decoded).toStrictEqual(initial);
    });
});