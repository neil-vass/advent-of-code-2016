import {expect, describe, it} from "vitest";
import {sayHello} from "./day01";

describe("Hello", () => {
    it("Runs a test", () => {
        expect(sayHello("Theo")).toBe("Hello, Theo!");
    });
});