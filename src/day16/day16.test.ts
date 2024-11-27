import {describe, expect, it} from "vitest";
import {generateChecksum, generateData} from "./day16.js";

describe("Part 1", () => {
    it("Performs single step", () => {
        expect(generateData("1", 3)).toBe("100");
        expect(generateData("111100001010", 25)).toBe("1111000010100101011110000");
    });

    it("Generates checksum", () => {
        expect(generateChecksum("110010110100")).toBe("100");
    });

    it("Matches example", () => {
        const data = generateData("10000", 20);
        expect(data).toBe("10000011110010000111");
        expect(generateChecksum(data)).toBe("01100");
    });
});