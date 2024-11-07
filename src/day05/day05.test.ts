import {expect, describe, it} from "vitest";
import {betterPasswordFor, passwordFor} from "./day05.js";

describe("Part 1", () => {
    it("Finds password", () => {
        expect(passwordFor("abc")).toBe("18f47a30");
    });
});

describe("Part 2", () => {
    it("Finds better password", () => {
        expect(betterPasswordFor("abc")).toBe("05ace8e3");
    });
});