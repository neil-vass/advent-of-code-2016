import {describe, expect, it} from "vitest";
import {corrected, countsAtEachPosition, mostFrequentLetterIn} from "./day06.js";
import {Sequence} from "../helpers/sequence.js";

describe("Part 1", () => {
    it("Collects letter counts", async () => {
        const messages = new Sequence([
            "eed",
            "drd",
            "ead"
        ]);

        expect(await countsAtEachPosition(messages)).toStrictEqual([
            { "e": 2, "d": 1 },
            { "e": 1, "r": 1, "a": 1 },
            { "d": 3 },
        ]);
    });

    it("Finds most common letters", () => {
        expect(mostFrequentLetterIn({
            "e": 2, "r": 3, "a": 1
        })).toBe("r");
    });

    it("Finds correct message", async () => {
        const messages = new Sequence([
            "eedadn",
            "drvtee",
            "eandsr",
            "raavrd",
            "atevrs",
            "tsrnev",
            "sdttsa",
            "rasrtv",
            "nssdts",
            "ntnada",
            "svetve",
            "tesnvt",
            "vntsnd",
            "vrdear",
            "dvrsen",
            "enarar"
        ]);
        expect(await corrected(messages)).toBe("easter");
    });
});