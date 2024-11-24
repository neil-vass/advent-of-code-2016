import {expect, describe, it, beforeEach} from "vitest";
import {Sequence} from "generator-sequences";
import {Factory, BOT, OUTPUT, parseBotSetupLine} from "./day10.js";

describe("Part 1", () => {
    let input: Sequence<string>;

    beforeEach(() => {
        input = new Sequence([
            "value 5 goes to bot 2",
            "bot 2 gives low to bot 1 and high to bot 0",
            "value 3 goes to bot 1",
            "bot 1 gives low to output 1 and high to bot 0",
            "bot 0 gives low to output 2 and high to output 0",
            "value 2 goes to bot 2",
        ]);
    });

    it("Bots can hold 2 chips max", () => {
        const bot = parseBotSetupLine("bot 2 gives low to bot 1 and high to bot 0");
        expect(bot.label).toBe(2);
        bot.receiveChip(1);
        bot.receiveChip(2);
        expect(() => bot.receiveChip(3)).toThrow();
    });

    it("Bots send chips to correct recipients", () => {
        const bot = parseBotSetupLine("bot 2 gives low to bot 1 and high to bot 0");
        expect(bot.label).toBe(2);
        bot.receiveChip(10);
        bot.receiveChip(5);
        expect(bot.giveChips()).toStrictEqual([
            { chip: 5, hardware: BOT, label: 1 },
            { chip: 10, hardware: BOT, label: 0 }
        ]);

        // Chips should be gone.
        expect(bot.giveChips()).toStrictEqual([]);
    });


    it("Builds", async () => {
        const sut = await Factory.buildFromDescription(input);
        // An interesting question ... what can we assert, since everything's internal?
    });

    it("Identifies given condition", async () => {
        const sut = await Factory.buildFromDescription(input);
        expect(sut.whichBotCompares(5, 2)).toBe(2);
    });
});