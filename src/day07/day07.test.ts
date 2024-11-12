import {describe, expect, it} from "vitest";
import {supportsTLS} from "./day07.js";


describe("Part 1", () => {
    it("TLS if has ABBA outside of brackets", () => {
        expect(supportsTLS("abba[mnop]qrst")).toBe(true);
    });
});