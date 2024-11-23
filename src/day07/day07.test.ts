import {describe, expect, it} from "vitest";
import {hasABBA, splitAddress, supportsSSL, supportsTLS} from "./day07.js";


describe("Part 1", () => {
    it("Recognizes ABBAs", () => {
        expect(hasABBA("abbc")).toBe(false);
        expect(hasABBA("aaaa")).toBe(false);
        expect(hasABBA("abba")).toBe(true);
        expect(hasABBA("ioxxoj")).toBe(true);
    });

    it("Splits IP addresses", () => {
        expect(splitAddress("abba[mnop]qrst")).toStrictEqual({
            standard: ["abba", "qrst"],
            hypernet: ["mnop"]
        });
    });

    it("Solves TLS examples from description", () => {
        expect(supportsTLS("abba[mnop]qrst")).toBe(true);
        expect(supportsTLS("abcd[bddb]xyyx")).toBe(false);
        expect(supportsTLS("aaaa[qwer]tyui")).toBe(false);
        expect(supportsTLS("ioxxoj[asdfgh]zxcvbn")).toBe(true);
    });
});

describe("Part 2", () => {
    it("Solves examples from description", () => {
        expect(supportsSSL("aba[bab]xyz")).toBe(true);
        expect(supportsSSL("xyx[xyx]xyx")).toBe(false);
        expect(supportsSSL("zazbz[bzb]cdb")).toBe(true);
    });
});