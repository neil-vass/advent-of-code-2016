import {describe, expect, it} from "vitest";
import {doorIsOpen, hash, isInBounds, solvePart1, solvePart2, VaultExplorer} from "./day17.js";


describe("Part 1", () => {
    it("Finds first 4 letters of hash", () => {
        expect(hash("hijkl")).toBe("ced9");
    });

    it("Does bounds checking", () => {
        expect(isInBounds({path:"", x:0, y:0})).toBe(true);
        expect(isInBounds({path:"", x:-1, y:0})).toBe(false);
        expect(isInBounds({path:"", x:1, y:3})).toBe(true);
        expect(isInBounds({path:"", x:1, y:4})).toBe(false);
    });

    it("Identifies open doors", () => {
        expect(doorIsOpen("hijkl", "", "U")).toBe(true);
        expect(doorIsOpen("hijkl", "", "R")).toBe(false);
    });

    it("Finds shortest path", () => {
        expect(solvePart1("ihgpwlah")).toBe("DDRRRD");
        expect(solvePart1("kglvqrro")).toBe("DDUDRLRRUDRD");
    });
});

describe("Part 2", () => {
    it("Solves examples", () => {
        expect(solvePart2("ihgpwlah")).toBe(370);
        expect(solvePart2("kglvqrro")).toBe(492);
        expect(solvePart2("ulqzkmiv")).toBe(830);
    });
});