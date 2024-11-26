import {expect, describe, it} from "vitest";
import {indexOfKey} from "./day14.js";

describe("Part 1", () => {
    it("Matches example", () => {
        const salt = "abc"
        expect(indexOfKey(1, salt)).toBe(39);
        expect(indexOfKey(64, salt)).toBe(22728);
    });
});