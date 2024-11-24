import {expect, describe, it} from "vitest";
import {Sequence} from "generator-sequences";
import {Factory, BOT, OUTPUT} from "./day10.js";

describe("Part 1", () => {
    it("Builds", async () => {
        const input = new Sequence([
            "value 5 goes to bot 2",
            "bot 2 gives low to bot 1 and high to bot 0",
            "value 3 goes to bot 1",
            "bot 1 gives low to output 1 and high to bot 0",
            "bot 0 gives low to output 2 and high to output 0",
            "value 2 goes to bot 2",
        ]);

        const sut = await Factory.buildFromDescription(input);
        expect(sut.bots()).toStrictEqual({
            0: {
                holding: [],
                low: { hardware: OUTPUT, label: 2 },
                high: { hardware: OUTPUT, label: 0 } },
            1: {
                holding: [3],
                low: { hardware: OUTPUT, label: 1 },
                high: { hardware: BOT, label: 0 } },
            2: {
                holding: [5, 2],
                low: { hardware: BOT, label: 1 },
                high: { hardware: BOT, label: 0 } },
        });
    });
});