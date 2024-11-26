import {expect, describe, it} from "vitest";
import {Assembunny} from "./day12.js";

describe("Part 1", () => {
    it("Runs instructions", () => {
        const sut = new Assembunny();
        const instructions = [
            "cpy 41 a",
            "inc a",
            "inc a",
            "dec a",
            "jnz a 2",
            "dec a",
        ];
        sut.run(instructions);
        expect(sut.getRegisterValue("a")).toBe(42);
    });
});