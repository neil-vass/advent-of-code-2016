import {describe, expect, it} from "vitest";
import {Keypad, part1, part2} from "./day02.js";
import {Sequence} from "../helpers/sequence.js";


describe("Part 1", () => {
    it("Follows a no-op instruction", () => {
        const pad = new Keypad();
        expect(pad.moveAndPress("")).toBe("5");
    });

    it("Follows a single-move instruction", () => {
        const pad = new Keypad();
        expect(pad.moveAndPress("U")).toBe("2");
    });

    it("Follows a multi-move instruction", () => {
        const pad = new Keypad();
        expect(pad.moveAndPress("ULL")).toBe("1");
    });

    it("Follows a sequence of instructions", async () => {
        const instructions = new Sequence([
            "ULL",
            "RRDDD",
            "LURDL",
            "UUUUD"
        ]);
        expect(await part1(instructions)).toBe("1985");
    });
});

describe("Part 2", () => {
    it("Solves example", async () => {
        const instructions = new Sequence([
            "ULL",
            "RRDDD",
            "LURDL",
            "UUUUD"
        ]);
        expect(await part2(instructions)).toBe("5DB3");
    });
});