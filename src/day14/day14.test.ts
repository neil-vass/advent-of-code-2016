import {expect, describe, it} from "vitest";
import {indexOfKey, stretchedHash} from "./day14.js";

describe("Part 1", () => {
    it("Matches example", () => {
        const salt = "abc"
        expect(indexOfKey(1, salt)).toBe(39);
        expect(indexOfKey(64, salt)).toBe(22728);
    });
});

describe("Part 2", () => {
    it("Matches example", () => {
        const salt = "abc"
        expect(indexOfKey(1, salt, stretchedHash)).toBe(10);
        expect(indexOfKey(64, salt, stretchedHash)).toBe(22551);
    });
});