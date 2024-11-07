import {expect, describe, it} from "vitest";
import {hashOf, passwordFor} from "./day05.js";

describe("Part 1", () => {
    it("Finds hash", () => {
        const hash = hashOf("abc", 3231929);
        expect(hash.slice(0, 6)).toBe("000001");
    });

    it("Finds password", () => {
        expect(passwordFor("abc")).toBe("18f47a30");
    });
});